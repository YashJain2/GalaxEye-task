#include <bits/stdc++.h>
using namespace std;
//map storing the pattern next output
map<vector<int>,vector<int>> mp;


vector<vector<int>> generateBinaryCombinations(int length) {
    vector<vector<int>> combinations;
    int numCombinations = pow(2, length);
    for (int i = 0; i < numCombinations; i++) {
        vector<int> combination(length);
        for (int j = 0; j < length; j++) {
            combination[length - j - 1] = (i >> j) & 1;
        }
        combinations.push_back(combination);
    }
    return combinations;
}

vector<int> func(vector<int> arr){
    // Runs 8 times
    for(int i = 0;i<arr.size();i++){
        if(i == 0){
            if(arr[arr.size()-1] == arr[i+1]){
                if(arr[i] == 0){
                    arr[i] = 1;
                }
            }
            else{
                if(arr[i] == 1){
                    arr[i] = 0;
                }        
            }
        }
        else if(i == arr.size()-1)
        {
             if(arr[0] == arr[i-1]){
                if(arr[i] == 0){
                    arr[i] = 1;
                }
            }
            else{
                if(arr[i] == 1){
                    arr[i] = 0;
                }
            }
        }
        else{
            if(arr[i-1] == arr[i+1]){
                if(arr[i] == 0){
                    arr[i] = 1;
                }
            }
            else{
                if(arr[i] == 1){
                    arr[i] = 0;
                }
            }
        }
    }
    return arr;
}

//Optimized Approach: Since we have only 8 orbits with 0s & 1s
// Total number of patterns -> 256
// Also after the certain pattern occurs next pattern will remains same 
// So we can create a map of vector to vector of all the 256 combinations possible with next pattern

// Result after 5th : 1 0 0 0 0 1 1 1
int main() {
    int length = 8;
    vector<vector<int>> binaryCombinations = generateBinaryCombinations(length);

    // 256 combinations of binary array
    for (vector<int> combination : binaryCombinations) {
        vector<int> newArr = func(combination);
        mp[combination] = newArr;
    }

    int days = 5;
    vector<int> intialConfig{1,1,0,1,1,1,0,0};
    vector<int> tempArr;
    for(int i =0;i<days;i++){
        //takes log(n)
        intialConfig =  mp[intialConfig];
    }
    for(auto num: intialConfig){
        cout<<num<<" ";
    }
    return 0;
}


// Time Complexity: O(1) -> for creating all 256 combinations
//                 + O(1) -> for creating map  256 * 8 
//                 + O(days)* O(lg(256)) -> for finding the next pattern in map
//So the time complexity of this code is constant