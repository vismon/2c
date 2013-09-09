function convertAndShow(filename) {
	return true
}
function countString(str, search){
	var count = 0;
	var index = str.indexOf(search);
	while(index != -1){
		count++;
		index = str.indexOf(search,index + 1);
		}
	return count;
	}

