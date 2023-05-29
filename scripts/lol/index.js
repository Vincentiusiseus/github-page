console.log("Hello from lol/index.js")

window.addEventListener("DOMContentLoaded", () => {
    const api_container = document.getElementById("api-container")
    const api_input_comp_temp = api_container.querySelector("template")
    console.log(api_input_comp_temp)

    function removeApiInputComp() {
        const comp = this.closest(".api-input-comp")
        comp.remove()
    }

    function addApiInputComp() {
        const list = api_container.querySelector("#api-key-list")
        console.log(api_input_comp_temp)
        const cloned_comp = api_input_comp_temp.content.cloneNode(true)

        const remove_button = cloned_comp.querySelector("button")
        remove_button.addEventListener("click", removeApiInputComp)

        list.appendChild(cloned_comp)
    }
    addApiInputComp()

    const add_api_comp_button = document.getElementById("add-api-comp-button")
    add_api_comp_button.addEventListener("click", addApiInputComp)
})