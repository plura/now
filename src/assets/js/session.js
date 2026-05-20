const KEY_INTRO = 'plura_intro_seen';

export const hasSeenIntro = () => sessionStorage.getItem(KEY_INTRO) === '1';
export const markIntroSeen = () => sessionStorage.setItem(KEY_INTRO, '1');
