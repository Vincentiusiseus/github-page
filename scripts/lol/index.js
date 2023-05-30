console.log("Hello from lol/index.js")

let db = null

window.addEventListener("DOMContentLoaded", async () => {
    const api_container = document.getElementById("api-container")
    const api_input_comp_temp = api_container.querySelector("template")
    const db_name = "lol_page"

    function removeApiInputComp() {
        const comp = this.closest(".api-input-comp")
        comp.remove()
    }

    function addApiInputComp(store_key, api_key) {
        const list = api_container.querySelector("#api-key-list")
        const cloned_comp = api_input_comp_temp.content.cloneNode(true)

        const remove_button = cloned_comp.querySelector("button")
        remove_button.addEventListener("click", removeApiInputComp)

        const input_el = cloned_comp.querySelector("input")
        input_el.value = api_key
        input_el.dataset.storeKey = store_key
        input_el.addEventListener("input", (ev) => {
            console.log(ev, ev.target.value)
            const new_value = ev.target.value
            const transaction = db.transaction("api_keys", "readwrite").objectStore("api_keys")
            const req = transaction.put(new_value, store_key)
            req.onsuccess = (event) => {
                // console.log(event)
            }
        })

        list.appendChild(cloned_comp)
    }

    function onAddApiInputCompClicked() {
        const transaction = db.transaction("api_keys", "readwrite").objectStore("api_keys")
        const req = transaction.add("")
        req.onsuccess = (ev) => {
            const key = ev.target.result
            const req = db.transaction("api_keys", "readonly").objectStore("api_keys").get(key)
            req.onsuccess = (ev) => {
                const value = ev.target.result
                addApiInputComp(key, value)
            }
        }
    }

    const add_api_comp_button = document.getElementById("add-api-comp-button")
    add_api_comp_button.addEventListener("click", onAddApiInputCompClicked)

    async function loadApiInputList() {
        const request = indexedDB.open(db_name, 1)
        const promise = new Promise((res, rej) => {
            request.onerror = (event) => {
                console.log("ERROR")
                rej()
            }
            request.onupgradeneeded = (event) => {
                console.log("On upgrade needed")
                const db = event.target.result
                const object_store = db.createObjectStore("api_keys", { autoIncrement: true })
                object_store.transaction.oncomplete = (event) => {
                    console.log("Created object store")
                    const transaction = db.transaction("api_keys", "readwrite").objectStore("api_keys")
                    const req = transaction.add("")
                    req.onsuccess = () => {
                        res(db)
                    }
                }
            }
            request.onsuccess = (event) => {
                const db = event.target.result
                console.log("Success")
                res(db)
            }
        })
        db = await promise

        async function _loadApiInputList() {
            const transaction = db.transaction("api_keys", "readonly").objectStore("api_keys")
            const api_keys_keys = await new Promise((res, rej) => {
                const request = transaction.getAllKeys()
                request.onsuccess = (event) => {
                    res(event.target.result)
                }
            })
            const api_keys_values = await new Promise((res, rej) => {
                const request = transaction.getAll()
                request.onsuccess = (event) => {
                    res(event.target.result)
                }
            })
            
            api_keys_keys.forEach((key, index) => {
                const api_key = api_keys_values[index]
                addApiInputComp(key, api_key)
            })
        }
        await _loadApiInputList()
    }
    await loadApiInputList()
})