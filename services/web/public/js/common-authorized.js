restapi.get(AS_URL, '/api/user/detail', null, localStorage.getItem('TOKEN'), '/sign-in', function(msgResp) {
	var user = msgResp;

	// Update user avatar
	if (user.photoUrl) document.getElementById('userAvatar').src = user.photoUrl;
}, function(msg) {
	console.log(msg);
});

function signOut() {
	localStorage.clear();
	location.href = '/sign-in';
}