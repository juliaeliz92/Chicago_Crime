const readline = require('readline');
const fs = require('fs');
var lines;
var flagHeader=true;
var index,ind;
var year1=2001;
var year2=2016;
var year3=year1;

var outputFirst=new Array((year2-year1)+1).fill(JCrime);
outputFirst=outputFirst.map(function(obj)
{
	var theftObj={};
	theftObj["over500"]=0;
	theftObj["under500"]=0;
	theftObj["year"]=year1++;
	JCrime=JSON.stringify(theftObj);
	return JCrime;

});
var outputSec=new Array((year2-year3)+1).fill(JCrime);
outputSec=outputSec.map(function(obj)
{
	var assaultObj={};
	assaultObj["arrested"]=0;
	assaultObj["notarrested"]=0;
	assaultObj["year"]=year3++;
	JCrime=JSON.stringify(assaultObj);
	return JCrime;

});
var JCrime=new Object();
var primIndex, descIndex, arrestIndex,yearIndex,over=[],under=[],arrest=[],narrest=[];
var index,over,under;
function findIndex(lines)
{
	primIndex=lines.indexOf("Primary Type");
	descIndex=lines.indexOf("Description");
	arrestIndex=lines.indexOf("Arrest");
	yearIndex=lines.indexOf("Year");
}
const rl = readline.createInterface
({
  input: fs.createReadStream('Crime.csv')
});
function checkFirstCondition(lines)
{
	var reg=new RegExp(/500/);
	if(lines[primIndex]=="THEFT"&&reg.test(lines[descIndex]))
	{
		index=lines[yearIndex];
		if(isNaN(over[index]))
		{
			over[index]=0;
			under[index]=0;
		}
		if(lines[descIndex]=="OVER $500")
		over[index]++;
		if(lines[descIndex]=="$500 AND UNDER")
		under[index]++;
		ind=(index%2000)-1;
		var data=new Object();
		data.over500=over[index];
		data.under500=under[index];
		data.year=Number(index);
		JCrime=JSON.stringify(data)
		outputFirst[ind]=JCrime;
		
	}	
}
function checkSecondCondition(lines)
{
	var reg2=new RegExp(/ASSAULT/);
	if(reg2.test(lines[primIndex]))
	{
		index=lines[yearIndex];
		if(isNaN(arrest[index]))
		{
			arrest[index]=0;
			narrest[index]=0;
		}
		if(lines[arrestIndex]=="true"||lines[arrestIndex]=="TRUE")
		arrest[index]++;
		if(lines[arrestIndex]=="false"||lines[arrestIndex]=="FALSE")
		narrest[index]++;
		ind=(index%2000)-1;
		var data=new Object();
		data.arrested=arrest[index];
		data.notarrested=narrest[index];
		data.year=Number(index);
		JCrime=JSON.stringify(data)
		outputSec[ind]=JCrime;
		
	}	
}
rl.on('line', (line) => {
	
	lines=line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
	if(flagHeader)
	{	
		
		flagHeader=false;
		findIndex(lines);
	}
	
	else
	{	
		checkFirstCondition(lines);
		checkSecondCondition(lines);
	}
	
});
rl.on('close',function(){
	
fs.writeFile("Assault.JSON",outputSec,(err)=>{
				if(err)
				{
					throw err;
				}
			});
fs.writeFile("Theft.JSON",outputFirst,(err)=>{
				if(err)
				{
					throw err;
				}
			});
			});
