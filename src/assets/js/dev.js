const mode = new URLSearchParams(location.search).get('dev');
export default { active: mode !== null, mode };
