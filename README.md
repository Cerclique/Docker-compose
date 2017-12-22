# Genetic Algorithm - [link](./algoGen.js)
## **Overview**

This algorithm generates a path from *depCity* to *arrCity* by maximizing the resources harvested. Here is the prototype :
```js
const algoGen = (depCity, arrCity, errorThreshold = 0.01, maxIteration = 100, nbChromosome = 15, mutationOdd = 0.1)
```
The *depCity* is not in the chromosome, but the *arrCity* is at the end of each. The size of each chromosome is random. 

## **Description**
Following are the main steps detailed :
### **Initialization**
Creation of the first parents (which their size is random from **2** to **20**).

### **Creation of children by Cross-Over**
Creation of children by **Cross-over** at a random index from each of two random parents. We just have to maintain the maximum size a chromosome can have.

### **Mutation of children**
Mutation Odd is set at 10%, but the last gene of each chromosome cannot mutate as it represents the *arrCity*.

### **Checking of chromosomes**
Some additionnal rules to have better results :
1. Never the same city(~gene) twice in a row
2. No more than twice the same city in a chromosome

### **Computing scores of chromosomes**
We mesure how many resources a truck harvest and the distance traveled. We suppose a truck have no cargo limit. Plus, a malus is applied if the distance traveled is over  *limitKM = 3000*.

### **Updating moving average**
We keep track of the score average of the last five iterations. The *error* is calculated as the difference between the current iteration and the mean of the last five averages, as percentage.

### **Selection**
The new parents are selected as the 73% best chromosomes. (Because Why not ?).

### **Iteration**
The exit condition required are both :
1. At least 5 iterations
2. An *error* < *errorThreshold = 1%*

### **Returned object**
The object returned is composed of :
* the path (from *depCity* to *arrCity* included)
* the number of resources harvested (minus the malus if there is one)
* the distance traveled
* the number of iteration
* the final error