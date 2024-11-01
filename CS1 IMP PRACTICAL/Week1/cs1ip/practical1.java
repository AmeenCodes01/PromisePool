//////////// WEEK 2 
Scanner input = new Scanner(System.in);

// Task 2 

// System.out.println("enter radius:");

// double radius = input.nextDouble();

// if (radius >= 0){
// System.out.printf("The area of circle is %.2f", Math.PI*Math.pow(radius,2) );
// }else{
// System.out.println("not possible");
// }

// Task 3 
// System.out.println("weekend y/n ?");
// char ans = input.nextLine().charAt(0);

// boolean weekday = ans == 'y' 
// System.out.println("hour ?");
// int time = input.nextInt();



// if((time>= 9) && (time <= 11)){
	
	// if (weekday){
		// System.out.println("Go to lecture");
	// }
				
// }else if ((time >=12) && (time <= 17)){
	// if (weekday){
		// System.out.println("Go to lab");
	// }else{
		// System.out.println("You can rest now");
	// }
// }else{
	// System.out.println("Time for bed");
// }

//------------------------------------------[


// W E E K 3 

//TASK 5
// System.out.println("start:")
// int start = input.nextInt();
// System.out.println("end:")
// int end = input.nextInt();

// // while (i < 10){
	// // i++;
// // System.out.println(i);
// // }

// for (int n=start; n <=end; n=n+1){
 // System.out.println(n %2 == 0 ? n:"") ;
// }

//TASK6

// for (int n=1;n<=5;n=n+1){
	// System.out.println();
	// for(int m=1;m<=n;m=m+1){
		// System.out.print(m);
		
		
	// }
// }
//TASK7

// for (int n=1;n<=5;n=n+1){
	// System.out.println();
		// for(int k=5-n;k>=0;k=k-1){
		// System.out.print("#");
	// }
	// for(int m=1;m<=n;m=m+1){
	
	// System.out.print("n");
	// System.out.print(m);
		
		
	// }
// }

//Task8

// for (int n=1;n<=8;n=n+1){
	// System.out.println();
		// System.out.print(n %2 != 0 ? " ":"");

		// for(int k=1;k<=4;k=k+1){
		
	// System.out.print("#");
	// System.out.print(" ");
	// }
		
		
	
// }

//TASK 9 

// System.out.println("string:")
// String str = input.nextLine();
// System.out.println("second:")
// String rev = input.nextLine();

// String trueRev="";
// for (int n=str.length()-1;n >= 0;n-=1){
// //	System.out.println(str.charAt(n));
	// trueRev += str.charAt(n);
// }
// //System.out.print(rev==trueRev ?"anagram":"not, actual is "+ trueRev);
	// if (rev==trueRev){
		// System.out.println("anagram");
	// }else{
		// System.out.println("NOT");
	// }
//System.out.println(" ")
//System.out.println(rev+ "h"+ trueRev)


//------------------------------------WEEK 4 PRACTICAL-----------

//Task 1 
// int square(int a){
// return a*a ;
// }
// assert square(3) == 9;
// assert square(4) == 16;
// assert square(5) == 25;
// System.out.println("all test pass")


//TASK 2 

// String concatf(String a, String b){
// return a + b;
// }

// assert concatf("Hello","World") =="HelloWorld"

// System.out.println(concatf("Hello","World"))

//TASK 3

// String checkEvenOdd(int a){
	
// return	(a%2 != 0  ? "odd":"even");

// }
// assert checkEvenOdd(10) == "even"
// assert checkEvenOdd(1) == "odd"
// assert checkEvenOdd(3) == "odd"
// assert checkEvenOdd(10) == "even"

// System.out.println(checkEvenOdd(2) + " "+ "test pass");

//TASK 4 

// String revString(String str){
// String trueRev="";
// for (int n=str.length()-1;n >= 0;n-=1){
	// trueRev += str.charAt(n);
// }
// return trueRev;
// }

// assert revString("Java") == "avaJ";
// assert revString("Hello, World!").equals("!dlroW ,olleH")

// System.out.println("test pass")

//TASK 5 

// int fibonacci(int n){
 // if(n <=1){
 // return n;
 // }
 // return fibonacci(n-1) + fibonacci(n-2);

// }
// assert fibonacci(6) == 8;
// assert fibonacci(4) == 3;
// assert fibonacci(10) == 55;
// assert fibonacci(12) == 144;
// System.out.println("all tests passed")

//TASK 6 

// int power(int base, int exp){
	// if (exp== 2){
	// return base*base;
	// }
		// if (exp <= 1){
	// return base;
	// }
// //	System.out.println(p);
 
	// return base*power(base*base,exp-2);
// }

// // b=2, e=3 goes in.
// // b =2*2 =4 , e =2
// // b =4*4=16, e = 1



// assert power(2, 3) == 8;
// assert power(3, 2) == 9;
// assert power(10, 3) == 100;
// System.out.print( power(3,2));

//TASK 7 
int countVowels(String str, int v) {
if(str.length() <1){
	return v;
}
if (str.charAt(str.length()-1).equals("a") ||str.charAt(str.length()-1).equals("e") || str.charAt(str.length()-1).equals("i")|| str.charAt(str.length()-1).equals("o") || str.charAt(str.length()-1).equals("u"))
{
v = v + 1;
}

return countVowels(str.substring(0,str.length()-1),v);
}

// assert countVowels("Hello World",1) == 3;
assert countVowels("Imperative",1) == 5;
assert countVowels("Programming",1) == 3;
System.out.println("all tests passed");