const baseBoardURL = 'http://localhost:3000/api/boards'
const baseTableURL = 'http://localhost:3000/api/tables'
const baseTaskURL = 'http://localhost:3000/api/tasks'

const getBoard = async () => {
    const res = await axios.get(`${baseBoardURL}`)
    return res.data
}

const putBoardById = async (newBoard) => {
    await axios.put(`${baseBoardURL}`, newBoard)
}

const getTable = async (tableId) => {
    const res = await axios.get(`${baseTableURL}/${tableId}`)
    return res.data
}

const postTable = async (newTable) => {
    const res = await axios.post(`${baseTableURL}`, newTable)
    return res.data
}

const putTableById = async (newTable) => {
    await axios.put(`${baseTableURL}/${newTable._id}`, newTable)
}

const deleteTableById = async (tableId) => {
    await axios.delete(`${baseTableURL}/${tableId}`)
}

const postTask = async (tableId, newTask) => {
    const res = await axios.post(`${baseTaskURL}/${tableId}`, newTask)
    return res.data
}

const deleteTaskById = async (tableId, taskId) => {
    await axios.delete(`${baseTaskURL}/${tableId}/${taskId}`)
}