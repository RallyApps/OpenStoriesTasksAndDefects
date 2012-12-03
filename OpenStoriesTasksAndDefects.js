var iterDropdown;
var rallyDataSource;

function OpenStoriesTasksAndDefects() {
    var that = this;
    
    var busySpinner;
    var taskTable, defectTable, storyTable;
    var abbrev = {'User Story': 'ar', 'Defect': 'df', 'Task': 'tk', 'TestCase': 'tc'};

    function indentedItem(content, color) {
        var indentationDiv = '<div style="margin-left: 20px;">' + content + '</div>';
        return indentationDiv;
    }

    function ownerIfKnown(arti) {
        var owner = "";
        if (arti.Owner) {
            if (arti.Owner.DisplayName) {
                owner = arti.Owner.DisplayName;
            }
            else if (arti.Owner.UserName) {
                owner = arti.Owner.UserName;
            }
        }
        return owner;
    }

    function artifactLink(artifactName, artifact) {
        var artUrl = "__SERVER_URL__/detail/_ABBREV_/_OID_";
        artUrl = artUrl.replace('_ABBREV_', abbrev[artifactName]);
        artUrl = artUrl.replace('_OID_', artifact.ObjectID);
        var linkText = artifact.FormattedID + " " + artifact.Name;
        var link = '<a href="_URL_" target="_blank">_TEXT_</a>';
        link = link.replace('_URL_', artUrl);
        link = link.replace('_TEXT_', linkText);
        return link;
    }

    function showStories(stories, contentDiv) {
        var story,    storyLink,    storyInfo;
        var task,     taskLink,     taskInfo,     indentedTask;
        var defect,   defectLink,   defectInfo,   indentedDefect;
        var testCase, testCaseLink, tcInfo, indentedTestCase;
        var tableData = [];
        var tblConfig;

        for (var i = 0; i < stories.length; i++) {
            story = stories[i];
            storyLink = artifactLink('User Story', story);
            storyInfo = { 'itemLink' : '<div style="font-weight: bold;">' + storyLink + '</div>',
                'status'   : '<b>' + story.ScheduleState + '</b>',
                'userName' : ownerIfKnown(story)
            };
            tableData.push(storyInfo);

            for (var t = 0; t < story.Tasks.length; t++) {
                task = story.Tasks[t];
                taskLink = artifactLink('Task', task);
                indentedTask = indentedItem(taskLink);
                taskInfo = { 'itemLink' : indentedTask,
                    'status'   : task.State,
                    'userName' : ownerIfKnown(task)
                };
                if (task.State != 'Completed' && task.State != 'Accepted') {
                    tableData.push(taskInfo);
                }
            }

            for (var d = 0; d < story.Defects.length; d++) {
                defect = story.Defects[d];
                defectLink = artifactLink('Defect', defect);
                indentedDefect = indentedItem(defectLink);
                defectInfo = { 'itemLink' : indentedDefect,
                    'status'   : defect.ScheduleState,
                    'userName' : ownerIfKnown(defect)
                };
                var schedState = defect.ScheduleState;
                if (schedState != 'Completed' && schedState != 'Accepted') {
                    tableData.push(defectInfo);
                }
            }

            for (var tc = 0; tc < story.TestCases.length; tc++) {
                testCase = story.TestCases[tc];
                testCaseLink = artifactLink('TestCase', testCase);
                indentedTestCase = indentedItem(testCaseLink);
                tcInfo = { 'itemLink' : indentedTestCase,
                    'status'   : testCase.LastVerdict,
                    'userName' : ownerIfKnown(testCase)
                };
                // consider testing on testCase.LastVerdict != 'Pass' to decide whether to show in table
                tableData.push(tcInfo);
            }
        }
        tblConfig = { 'columnKeys'     : ['itemLink', 'status', 'userName'],
            'columnHeaders'  : ['Artifact', 'Status', 'Owner'   ],
            'columnWidths'   : ['400px',    '100px',  '100px'   ],
            'sortingEnabled' : false
        };

        storyTable = new rally.sdk.ui.Table(tblConfig);
        storyTable.addRows(tableData);
        storyTable.display(contentDiv);
    }

    function showTasks(tasks, contentDiv) {
        var tableData = [];
        var tblConfig;
        var task, taskLink, taskInfo;

        for (var t = 0; t < tasks.length; t++) {
            task = tasks[t];
            taskLink = artifactLink('Task', task);
            taskInfo = { 'taskLink' : taskLink,
                'status'     : task.State,
                'userName'   : ownerIfKnown(task)
            };
            tableData.push(taskInfo);
        }
        tblConfig = { 'columnKeys'     : ['taskLink', 'status', 'userName'],
            'columnHeaders'  : ['Task',     'Status', 'Owner'   ],
            'columnWidths'   : ['400px',    '100px',  '100px'   ],
            'sortingEnabled' : false
        };

        taskTable = new rally.sdk.ui.Table(tblConfig);
        taskTable.addRows(tableData);
        taskTable.display(contentDiv);
    }

    function showDefects(defects, contentDiv) {
        var tableData = [];
        var tblConfig;
        var defect, defectLink, defectInfo;

        for (var d = 0; d < defects.length; d++) {
            defect = defects[d];
            defectLink = artifactLink('Defect', defect);
            defectInfo = { 'defectLink' : defectLink,
                'status'     : defect.ScheduleState,
                'userName'   : ownerIfKnown(defect)
            };
            tableData.push(defectInfo);
        }
        tblConfig = { 'columnKeys'     : ['defectLink', 'status', 'userName'],
            'columnHeaders'  : ['Defect',     'Status', 'Owner'   ],
            'columnWidths'   : ['400px',      '100px',  '100px'   ],
            'sortingEnabled' : false
        };

        defectTable = new rally.sdk.ui.Table(tblConfig);
        defectTable.addRows(tableData);
        defectTable.display(contentDiv);
    }

    function showResults(results) {
        document.getElementById("UserNameHeader").innerHTML = "Open Items for __USER_NAME__";
        document.getElementById("stories_count").innerHTML = "";
        document.getElementById("tasks_count").innerHTML = "";
        document.getElementById("defects_count").innerHTML = "";
        if(busySpinner) {
            busySpinner.hide();
            busySpinner = null;
        }

        var ownedStories = results.stories;
        document.getElementById("stories_count").innerHTML = "Stories: " + ownedStories.length;
        if (ownedStories.length > 0) {
            showStories(ownedStories, "stories");
        }

        var ownedTasks = results.tasks;
        document.getElementById("tasks_count").innerHTML = "Tasks: " + ownedTasks.length;
        if (ownedTasks.length > 0) {
            showTasks(ownedTasks, "tasks");
        }

        var ownedDefects = results.defects;
        document.getElementById("defects_count").innerHTML = "Defects: " + ownedDefects.length;
        if (ownedDefects.length > 0) {
            showDefects(ownedDefects, "defects");
        }
    }

    that.onIterationSelected = function() {
        var targetIterationName = iterDropdown.getSelectedName();
        var iterCond = '(Iteration.Name = "_ITER_TARGET_")'.replace('_ITER_TARGET_', targetIterationName);
        var ownerCondition = '(Owner.UserName = "__USER_NAME__")';
        var scheduleStateCondition = '((ScheduleState != "Completed") AND (ScheduleState != "Accepted"))';
        var taskStateCondition = '(State != "Completed")';
        var storyCriteria = '(' + iterCond + ' AND ' +
                '(' + ownerCondition + ' AND ' + scheduleStateCondition + '))';
        var taskCriteria = '(' + iterCond + ' AND ' +
                '(' + ownerCondition + ' AND ' + taskStateCondition + '))';
        var defectCriteria = '(' + iterCond + ' AND ' +
                '(' + ownerCondition + ' AND ' + scheduleStateCondition + '))';
        var queryConfigs = [];
        queryConfigs[0] = { type : 'hierarchicalrequirement',
            key  : 'stories',
            fetch: 'ObjectID,FormattedID,Name,ScheduleState,State,' +
                    'Owner,UserName,DisplayName,Tasks,Defects,TestCases,LastVerdict',
            query: storyCriteria,
            order: 'Rank desc'
        };
        queryConfigs[1] = { type : 'task',
            key  : 'tasks',
            fetch: 'ObjectID,FormattedID,Name,Owner,UserName,DisplayName,State',
            query: taskCriteria,
            order: 'FormattedID'
        };
        queryConfigs[2] = { type : 'defect',
            key  : 'defects',
            fetch: 'ObjectID,FormattedID,Name,Owner,UserName,DisplayName,ScheduleState',
            query: defectCriteria,
            order: 'FormattedID'
        };
        busySpinner = new rally.sdk.ui.basic.Wait({});
        busySpinner.display("wait");

        if(storyTable) {
            storyTable.destroy();
            storyTable = null;
        }
        if(taskTable) {
            taskTable.destroy();
            taskTable = null;
        }
        if(defectTable) {
            defectTable.destroy();
            defectTable = null;
        }

        rallyDataSource.findAll(queryConfigs, showResults);
    };
}