// let name = "eric";
// let age = 24;
// let hobbies = ["fishing","coding","shopping","travelling"]; //array start from 0

// console.log(name,age,hobbies)

// hobbies.push("football");

// console.log(name,age,hobbies)
// hobbies.pop(); //remove last item
// console.log(hobbies)
// 	//console.log(hobbies.splice(1,3))

// let person = {
// 	name,age,hobbies
// }
// console.log(person)

// function calculateAgeInDays(age) {
// 	return age*365;
// 	// body...
// }

// console.log(calculateAgeInDays(25)); // 9125

// let globalVar = "nice";
// function testscope(){
// 	let localVar = "bad";
// 	console.log(globalVar);
// 	console.log(localVar);
// }

// testscope();


let numbers = [23,45,67,1,3,44];
for (let i = 0; i < numbers.length; i++) {
	if(numbers[i] %2 ===0){
		console.log(numbers[i]+"is even")
	}else{
		console.log(numbers[i]+"is odd")

	}
}