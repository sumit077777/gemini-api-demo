function submitForm1() {
  document.getElementById("sign-in").submit();
}
function submitForm2() {
  document.getElementById("sign-up").submit();
}
function showSignUp() {
  document.getElementById("signin-container").style.display = "none";
  document.getElementById("signup-container").style.display = "block";
}

function showSignIn() {
  document.getElementById("signup-container").style.display = "none";
  document.getElementById("signin-container").style.display = "block";
}

