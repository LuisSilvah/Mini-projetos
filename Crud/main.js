// Open Modal
const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active') 
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('dbClient')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("dbClient", JSON.stringify(dbClient))

// CRUD - create read update delete
const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push (client)
    setLocalStorage (dbClient)
}

const readClient = () => getLocalStorage()

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
} 

const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

const isValidFields = () => {
  return document.getElementById('cadastro').reportValidity()
}

// Interação com o layout
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
} 

const saveClient = () => {
    if (isValidFields()){
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }

        const index = document.getElementById('nome').dataset.index

        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        } 
    }

}

const createRow = (client, index) => {
    const newLine = document.createElement('tr')
    newLine.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.celular}</td>
    <td>${client.cidade}</td>
    <td>
    <button type="button" class="button green" id="edit-${index}" data-action="edit">editar</button>
    
    <button type="button" class="button red" id="delete-${index}" data-action="delete">excluir</button>
    </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newLine)
}

const clearTable = () => {
    const rows = document.querySelectorAll("#tableClient>tbody tr")
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

updateTable()

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const excludeClient = (index) => {
    const client = readClient()[index]
    const response = confirm(`Deseja realmmente excluir o cliente ${client.nome}`)
    if (response) {
    deleteClient(index)
    updateTable()
    }
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
} 

const editDelete = (event) => {
    if (event.target.type == 'button'){
        const [action, index] = event.target.id.split('-')

        if(action == 'edit') {
            editClient(index)
        } else {
            excludeClient(index)
        }
    }
}

// Event
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

document.querySelector('#tableClient>tbody')    
    .addEventListener('click', editDelete)