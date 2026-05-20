<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

if (!file_exists(__DIR__ . '/config.php')) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server configuration error.']);
    exit;
}
$config = require __DIR__ . '/config.php';

require_once __DIR__ . '/lib/phpmailer/Exception.php';
require_once __DIR__ . '/lib/phpmailer/PHPMailer.php';
require_once __DIR__ . '/lib/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// —— Honeypot ————————————————————————————————————————————————————————————————
if (!empty($_POST['botcheck'])) {
    echo json_encode(['success' => true]);
    exit;
}

// —— Sanitize ————————————————————————————————————————————————————————————————
$name    = strip_tags(trim($_POST['name']    ?? ''));
$email   = trim($_POST['email']              ?? '');
$phone   = strip_tags(trim($_POST['phone']   ?? ''));
$type    = strip_tags(trim($_POST['type']    ?? ''));
$message = strip_tags(trim($_POST['message'] ?? ''));

// —— Validate ————————————————————————————————————————————————————————————————
if (!$name || !$email || !$type || !$message) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

$email = filter_var($email, FILTER_SANITIZE_EMAIL);

// —— Type label ——————————————————————————————————————————————————————————————
$type_labels = [
    'website' => 'Website',
    'webapp'  => 'Web App',
    'mobile'  => 'Mobile App',
    'design'  => 'Design & Branding',
    'other'   => 'Other',
];
$type_label = $type_labels[$type] ?? $type;

// —— Build fields ————————————————————————————————————————————————————————————
$fields = array_filter([
    ['label' => 'Name',    'value' => $name],
    ['label' => 'Email',   'value' => $email],
    ['label' => 'Phone',   'value' => $phone],
    ['label' => 'Type',    'value' => $type_label],
    ['label' => 'Message', 'value' => $message],
], fn($f) => $f['value'] !== '');

function build_fields_html(array $fields): string {
    $html = '';
    foreach ($fields as $field) {
        $label  = htmlspecialchars($field['label'], ENT_QUOTES, 'UTF-8');
        $value  = nl2br(htmlspecialchars($field['value'], ENT_QUOTES, 'UTF-8'));
        $html  .= "
            <tr>
                <td class=\"label-cell\">{$label}</td>
                <td class=\"value-cell\">{$value}</td>
            </tr>";
    }
    return $html;
}

function build_email(string $form_name, array $fields, string $intro = ''): string {
    $template = __DIR__ . '/templates/email-contact.html';
    $html     = file_get_contents($template);
    return str_replace(
        ['%FORM_NAME%', '%INTRO%', '%FIELDS%', '%YEAR%'],
        [htmlspecialchars($form_name, ENT_QUOTES, 'UTF-8'), $intro, build_fields_html($fields), gmdate('Y')],
        $html
    );
}

function send_mail(array $cfg, string $to_email, string $to_name, string $subject, string $body, string $reply_email = '', string $reply_name = ''): bool {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = $cfg['smtp_host'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $cfg['smtp_user'];
        $mail->Password   = $cfg['smtp_pass'];
        $mail->SMTPSecure = $cfg['smtp_secure'] === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = (int) $cfg['smtp_port'];
        $mail->CharSet    = 'UTF-8';
        $mail->setFrom($cfg['from_email'], $cfg['from_name']);
        $mail->addAddress($to_email, $to_name);
        if ($reply_email) $mail->addReplyTo($reply_email, $reply_name);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $body;
        $mail->send();
        return true;
    } catch (Exception) {
        error_log('PHPMailer: ' . $mail->ErrorInfo);
        return false;
    }
}

// —— Notification ————————————————————————————————————————————————————————————
$sent = send_mail(
    $config,
    $config['to_email'],
    $config['to_name'],
    'Plura — new contact from site',
    build_email('New Contact', $fields),
    $email,
    $name
);

if (!$sent) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send. Please try again or reach us directly at hello@plura.pt.']);
    exit;
}

// —— Auto-reply ——————————————————————————————————————————————————————————————
$intro = '<p class="email-intro">Hi ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . ', thanks for reaching out to Plura.'
       . ' We\'ve received your message and will get back to you shortly.'
       . ' Below is a copy of your submission for your records.</p>';

send_mail(
    $config,
    $email,
    $name,
    'Plura — we received your message',
    build_email('Your message', $fields, $intro),
    $config['to_email'],
    $config['to_name']
);

// —— Done ————————————————————————————————————————————————————————————————————
echo json_encode(['success' => true]);
