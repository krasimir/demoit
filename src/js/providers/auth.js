const auth = {
  grandAccess(demoId) {
    window.top.location.href = `/login?did=${ demoId }`;
  }
}

export default auth;