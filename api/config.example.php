<?php
// Copy this file to config.php and fill in the values.
// config.php is gitignored and must be created manually on the server.
return [
    'smtp_host'   => '',        // e.g. mail.plura.pt
    'smtp_user'   => '',        // e.g. hello@plura.pt
    'smtp_pass'   => '',
    'smtp_port'   => 587,
    'smtp_secure' => 'tls',     // 'tls' (STARTTLS/587) or 'ssl' (SMTPS/465)

    'from_email'  => '',        // sending address (usually same as smtp_user)
    'from_name'   => 'Plura',

    'to_email'    => '',        // where contact notifications go
    'to_name'     => 'Plura',
];
