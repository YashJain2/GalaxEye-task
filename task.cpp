// 8 orbits of satellite orbits
// occupancy changes of orbit
// rule: if the orbit has 2 adjacent neighbours 
//if both are vacant or occupied then curent becomes occupied
//else it is vacant
//initial state: [1,1,0,1,1,1,0,0]
//edge cases are considered circular
#include<bits/stdc++.h>

using namespace std;
int change = 0;
int iteration = 0;

vector<int> func(vector<int> arr){
    for(int i = 0;i<arr.size();i++){
        if(i == 0){
            if(arr[arr.size()-1] == arr[i+1]){
                if(arr[i] == 0){
                    arr[i] = 1;
                    change++;
                }
            }
            else{
                if(arr[i] == 1){
                    arr[i] = 0;
                    change++;
                }        
            }
        }
        else if(i == arr.size()-1)
        {
             if(arr[0] == arr[i-1]){
                if(arr[i] == 0){
                    arr[i] = 1;
                    change++;
                }
            }
            else{
                if(arr[i] == 1){
                    arr[i] = 0;
                    change++;
                }
            }
        }
        else{
            if(arr[i-1] == arr[i+1]){
                if(arr[i] == 0){
                    arr[i] = 1;
                    change++;
                }
            }
            else{
                if(arr[i] == 1){
                    arr[i] = 0;
                    change++;
                }
            }
        }
    }
    iteration++;
    return arr;
}

// 1,1,0,1,1,1,0,0
// 0 1 0 1 1 1 0 0
// 0 1 0 1 1 1 0 0
// 0 1 1 1 1 1 0 0
// 0 1 1 1 1 1 0 0
// 0 1 1 1 1 0 0 0
// 0 1 1 1 1 0 1 0 -> after 1st day
// 0 0 0 0 1 1 0 1 -> after 2nd day

//On 1st day there are 5 occupied 3 vacant
//On 2nd day there are 3 occupied 5 vacant
//Since it is changing with each day and vacant and non-vacant are changing 
//So, there is no definitive pattern

//Since the number of satellite is also changing in an array as
//when the adjacent are different we specify the cell whether ocuppied or vacant as vacant

// Result after 5th : 1 0 0 0 0 1 1 1

int main(){
    int n = 5; // number of days 
    vector<int> arr {1,1,0,1,1,1,0,0}; // intial configuration
    vector<int> ans;
    for(int i = 0;i<n;i++){
        arr = func(arr);
        if(change == 0){
            break;
        }
        cout<<"Change["<<i+1<<"]: "<<change<<endl;
        change = 0;
    }
    for(int i=0;i<arr.size();i++){
        cout<<arr[i]<<" ";
    }
    cout<<endl;
    cout<<"Iteration: "<<iteration;
    return 0;
}
