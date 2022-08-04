let data = []

getData = async () => {
    const board = await getBoard()
    data = board.tables
    data = data.map((t) => {
        return getTable(t._id)
    })
    data = await Promise.all(data)
    render(data)
}

getData()

const render = (data) => {
    const div = document.getElementById("trello")
    div.innerHTML = ''
    for(let i = 0; i < data.length; i++) {
        
        div.innerHTML += `<div data-index='${i}' class='table'>
            <span class='delete deleteTable'>\u00D7</span>
            <h2>${data[i].name}</h2>
            <ul class = 'table${i}' data-index='${i}'></ul>
            <div class="addTask">
            <input id='input${i}' type="text" placeholder="Task Name ..." onkeypress="addTaskByKey(event, ${i})">
            <button onclick="addTask(${i})" class="addTaskBtn">Add Task</button>
            </div>
        </div>`
        const currentUl = document.querySelector(`.table${i}`)
        const arr = data[i].tasks
        for (let j = 0; j < arr.length; j++){
            currentUl.innerHTML += `<li data-index='${j}'>
            <span class='delete deleteTask'>\u00D7</span>${arr[j].name}</li>`
        }
    }
    div.innerHTML += `<div class="addTable">
        <input type="text" id="tableInput" placeholder="Table Name ..." onkeypress="addTableByKey(event)">
        <button onclick="addTable()" class="addTableBtn">Add Table</button>
    </div>`
}

const addTable = async () => {
    let input = document.getElementById('tableInput');
    if (!input.value){
        alert('Nhap ten bang truoc khi them')
        return
    }
    const tableName = input.value
    const newTable = await postTable({
        name: tableName,
    })
    data = [...data, newTable]
    render(data)
    input.value = '';
}

const addTableByKey = async (event) => {
    if(event.key === 'Enter'){
        await addTable()
    }
}

const addTask = async (i) => {
    let input = document.getElementById(`input${i}`)
    if (!input.value){
        alert('Nhap ten task truoc khi them')
        return
    }
    const tableId = data[i]._id
    const taskName = input.value
    const newTask = await postTask(tableId, {
        name: taskName,
    })
    data[i].tasks = [...data[i].tasks, newTask]
    render(data)
    input.value = ''
}

const addTaskByKey = async (event, index) => {
    if(event.key === 'Enter'){
        await addTask(index)
    }
}

const deleteTable = async (index) => {
    const tableId = data[index]._id
    await deleteTableById(tableId)
    data.splice(index, 1)
    render(data)
}

const deleteTask = async (tableIndex, taskIndex) => {
    const tableId = data[tableIndex]._id
    const taskId = data[tableIndex].tasks[taskIndex]._id
    await deleteTaskById(tableId, taskId)

    data[tableIndex].tasks.splice(taskIndex, 1)
    render(data)
}

let clone, dragging, draggingIndex, tableIndex, flagHandle
let curIndex, curTableIndex, beforeSwapIndex, afterSwapIndex
addEventListener('mousedown', e =>{
    dragging = e.target
    if(dragging.nodeName == 'LI' || dragging.matches('.table')){
        draggingIndex = parseInt(dragging.dataset.index)
        clone = dragging.cloneNode(true)
        dragging.parentElement.appendChild(clone)
        dragging.style.visibility = 'hidden'
        clone.classList.add('cloned')
        clone.style.left = e.clientX - 100 + 'px'
        clone.style.top = e.clientY - 20 + 'px'

        if (dragging.nodeName == 'LI'){
            tableIndex = parseInt(dragging.parentElement.dataset.index)
            beforeSwapIndex = [tableIndex, draggingIndex]
            afterSwapIndex = [tableIndex, draggingIndex]
        }
        flagHandle = 1
    } else if (dragging.matches('.deleteTable')) {
        deleteTable(dragging.parentElement.dataset.index)
    } else if (dragging.matches('.deleteTask')){
        const li = dragging.parentElement
        deleteTask(li.parentElement.dataset.index, li.dataset.index)
    }
})

addEventListener('mousemove', e =>{
    if(flagHandle){
        clone.style.left = e.clientX - 100 + 'px'
        clone.style.top = e.clientY - 20 + 'px'
        const y = e.clientY
        const x = e.clientX
        let rect, dy, dx 
        const curEl = e.target
        rect = curEl.getBoundingClientRect()           
        const curElParent = curEl.parentElement
        if(curEl.closest('li') && dragging.nodeName == 'LI'){
            dy = y - rect.top
            curIndex = parseInt(curEl.dataset.index)
            curTableIndex = parseInt(curElParent.dataset.index)
            afterSwapIndex[0] = curTableIndex
            tableIndex = curTableIndex
            if(dy < rect.height/2){
                curElParent.insertBefore(dragging, curEl)
            } else {
                curElParent.insertBefore(dragging, curEl.nextSibling)
            }
        } else if(curEl.matches('.table') && dragging.matches('.table')){
            flagHandle = 2
            dx = x - rect.left
            if(dx < rect.width/2){
                curElParent.insertBefore(dragging, curEl)
            } else {
                curElParent.insertBefore(dragging, curEl.nextSibling)
            }
        } else if(curEl.matches('.table') && dragging.nodeName == 'LI'){

        }
    }
})

addEventListener('mouseup', e =>{
    if(flagHandle == 1){
        const myUl = dragging.parentElement
        const arrLi = myUl.querySelectorAll('li')
        for(let i = 0; i < arrLi.length; i++){
            if(arrLi[i] === dragging){
                afterSwapIndex[1] = i 
            }
        }
        reOderTask(beforeSwapIndex, afterSwapIndex)
        render(data)
    } else if (flagHandle == 2){
        const myBoard = dragging.parentElement
        const arrTable = myBoard.querySelectorAll('.table')
        let dropIndex
        for(let i = 0; i < arrTable.length; i++){
            if(arrTable[i] === dragging){
                dropIndex = i
            }
        }
        reOderTable(draggingIndex, dropIndex)
        render(data)
    }
    dragging = null
    flagHandle = null
})

const reOderTask = async (from, to) => {
    const temp = data[from[0]].tasks[from[1]]
    data[from[0]].tasks.splice(from[1], 1)
    data[to[0]].tasks.splice(to[1], 0, temp)
    const newTaskIdArrayFrom = data[from[0]].tasks.map((t) => t._id)
    const newTaskIdArrayTo = data[to[0]].tasks.map((t) => t._id)

    await putTableById({
        _id: data[to[0]]._id,
        tasks: newTaskIdArrayTo,
    })
    await putTableById({
        _id: data[from[0]]._id,
        tasks: newTaskIdArrayFrom,
    })
}

const reOderTable = async (from, to) => {
    const temp = data[from]
    data.splice(from, 1)
    data.splice(to, 0, temp)
    const newTableIdArray = data.map((t) => t._id)

    await putBoardById({
        tables: newTableIdArray
    })
}