﻿
var ProjectManager = function(){
	
	var $addFormDom = null;
	var $status = {
	};

	function init(){

		//读取配置
		Common.loadProjectConfig(function(content){
			  for(var name in content){
			  	addProject(
			  		content[name].name,
			  		content[name].path,
			  		content[name].tasks.join(" "),
			  		content[name].currentTasks,name);

			  	//var p_num = $ProjectHash[name];
			  	
			  	if(content[name].isSelect)changeProject(name);
			  	if(content[name].currentTasks)document.querySelector("#js_right_ctn_"+name+" select").value = content[name].currentTasks;
			  }
		});
	}
	
	function initAddForm(){
		
		if($addFormDom)return false;
		
		$addFormDom = document.createElement("div");
		$addFormDom.className = "addForm";
		
		$addFormDom.innerHTML = '<div class="head"><span>新建工程</span><a href="javascript:void(0)" class="close" onclick="ProjectManager.hideAddForm()" title="关闭">&times;</a></div>\
			<div class="ctn">\
				<ul>\
					<li><label>工程名</label><input type="text" id="js_addform_name" placeholder="工程名" value="" /></li>\
					<li><label>工程地址</label><input type="text" id="js_addform_path" placeholder="工程地址" value="" /></li>\
					<li><label>任务列表</label><input type="text" id="js_addform_tasks" placeholder="默认为default,可以不填,多个用空格分开" /></li>\
				</ul>\
				<button class="add-btn" onclick="ProjectManager.addProject()">添加</button>\
			</div>';
		
		document.body.appendChild($addFormDom);
	}
	
	function showAddForm(){

		initAddForm();
		
		$addFormDom.style.display = "block";
	}
	
	function hideAddForm(){
		
		if($addFormDom)$addFormDom.style.display = "none";
	}
	
	function addProject(name,path,tasks,currentTasks,p_num){
		
		name = name  || $("js_addform_name").value;
		path = path || $("js_addform_path").value;
		tasks = tasks || $("js_addform_tasks").value || "default";

		if($ProjectHash[name])return alert("已经存在同名项目");

		p_num = p_num || Common.createProjectNum();
		
		//添加左边tab
		var li = document.createElement("li");
		li.innerHTML = '<a href="javascript:void(0)" id="js_left_bar_'+p_num+'" onclick="ProjectManager.changeProject('+p_num+')">'+name+'<br /><span title="'+path+'">'+path+'</span></a>';
		$("js_left_bar_list").appendChild(li);
		
		//添加右边的内容
		var tasks_list = tasks.split(" ");
		var tasks_html = "";
		for(var i=0;i<tasks_list.length;i++){
			tasks_html += '<option value="'+tasks_list[i]+'">'+tasks_list[i]+'</option>';
		}
		
		currentTasks = currentTasks || tasks_list[0] || "default";

		var div = document.createElement("div");
		div.id = "js_right_ctn_"+p_num;
		div.style.display = "none";
		div.innerHTML = '<div class="tool-list">\
					<select onchange="ProjectManager.changeTasks(this,'+p_num+')">'+tasks_html+'</select>\
					<button onclick="Main.start(this,'+p_num+')">启动</button>\
					<button onclick="Main.clearLog('+p_num+')">清空</button>\
					<button onclick="ProjectManager.delProject('+p_num+')">删除</button>\
				</div>\
				<div class="log"></div>';
		$("js_right").appendChild(div);

		$ProjectHash[name] = p_num;

		$ProjectList[p_num] = {
			path : path,
			name : name,
			tasks : tasks_list,
			currentTasks : currentTasks,
			isStart : false
		};
		
		hideAddForm();
	}

	function changeProject(p_num){

		if($CurrentProject == p_num)return false;

		if($CurrentProject){

			$("js_left_bar_"+$CurrentProject).className = "";
			$("js_right_ctn_"+$CurrentProject).style.display = "none";
			$ProjectList[$CurrentProject].isSelect = false;
		}

		$("js_left_bar_"+p_num).className = "select";
		$("js_left_bar_"+p_num).style.backgroundColor = "";
		$("js_right_ctn_"+p_num).style.display = "block";

		$CurrentProject = p_num;

		$ProjectList[p_num].isSelect = true;
	}

	function delProject(p_num){

		if($ProjectList[p_num].isStart)return alert("请先停止Grunt任务");
		
		delete $ProjectHash[$ProjectList[p_num].name];
		delete $ProjectList[p_num];

		$("js_left_bar_list").removeChild($("js_left_bar_"+p_num).parentNode);
		$("js_right").removeChild($("js_right_ctn_"+p_num));

		if($CurrentProject == p_num)$CurrentProject = "";
	}

	function changeTasks(selectDom,p_num){

		$ProjectList[p_num].currentTasks = selectDom.value;
	}
	
	var exports = {
		
		showAddForm : showAddForm,
		hideAddForm : hideAddForm,
		addProject : addProject,
		changeProject : changeProject,
		delProject : delProject,
		changeTasks : changeTasks,
		init : init
	};
	
	return exports;
}();

ProjectManager.init();