class Todo {
    constructor(list, modal, addButton, nameOfTask, descriptionOfTask) {

        // Получаем все необходимые DOM элементы
        this.list = document.querySelector('.view__list');
        this.modal = document.querySelector('.modal')
        this.addButton = document.querySelector('.main-button');
        this.nameInput = document.querySelector('#nameOfNewTask');
        this.descriptionInput = document.querySelector('#descriptionOfNewTask');
        this.allFilterButton = document.getElementById('#allFilter')
        this.activeFilterButton = document.querySelector('#activeFilter');
        this.completedFilterButton = document.querySelector('#completedFilter');
        // Состояние модалки
        this.modalIsOpen = false;

        // Список задач
        this.listOfTasks = [

        ];

        this.currentFilter = "all"

        // Иконки
        this.checkSvg = `           
         <svg class="main-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
            <path
                d="M 41.9375 8.625 C 41.273438 8.648438 40.664063 9 40.3125 9.5625 L 21.5 38.34375 L 9.3125 27.8125 C 8.789063 27.269531 8.003906 27.066406 7.28125 27.292969 C 6.5625 27.515625 6.027344 28.125 5.902344 28.867188 C 5.777344 29.613281 6.078125 30.363281 6.6875 30.8125 L 20.625 42.875 C 21.0625 43.246094 21.640625 43.410156 22.207031 43.328125 C 22.777344 43.242188 23.28125 42.917969 23.59375 42.4375 L 43.6875 11.75 C 44.117188 11.121094 44.152344 10.308594 43.78125 9.644531 C 43.410156 8.984375 42.695313 8.589844 41.9375 8.625 Z" />
        </svg>`
        this.addSvg = `
        <svg class="main-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12H20M12 4V20" stroke="#000000" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>
        `
    }

    // Инициализация 
    init() {
        this.openModal();
        this.render();
        this.filter();
    }
    openModal() {
        // Открываем/закрываем модалку
        this.addButton.addEventListener('click', () => {
            const nameOfTask = this.nameInput.value.trim(),
                descriptionOfTask = this.descriptionInput.value.trim()
            if (!this.modalIsOpen) {
                this.modal.classList.add('modal_active');
                this.addButton.innerHTML = this.checkSvg;
                this.modalIsOpen = true
                return
            }
            if (nameOfTask == '') {
                alert('Type a name of the task')
                return
            }
            // Создаём новую задачу
            this.addNewTask(nameOfTask, descriptionOfTask);
            this.addButton.innerHTML = this.addSvg;
            this.modal.classList.remove('modal_active')
            this.modalIsOpen = false
        })
    }
    filter() {
        let removeActiveFilters = (target) => {
            document.querySelectorAll('.view__filter').forEach((e) => {
                if (target != e) {
                    e.classList.remove('view__filter_active')
                }
                target.classList.add('view__filter_active')
            })
        }
        this.activeFilterButton.addEventListener("click", e => {
            e.preventDefault();

            this.currentFilter = "active"
            this.render()
            removeActiveFilters(e.target)
        })
        this.allFilterButton.addEventListener("click", e => {
            e.preventDefault()
            this.currentFilter = "all"
            this.render()
            removeActiveFilters(e.target)
        })
        this.completedFilterButton.addEventListener("click", e => {
            this.currentFilter = "completed";
            this.render();
            removeActiveFilters(e.target)
        })
    }

    // Подгружаем задачи в html
    render() {
        let obj = ""
        if (this.currentFilter == "all") obj = this.listOfTasks
        else if (this.currentFilter == "active") obj = this.listOfTasks.filter(x => x.status == false)
        else if (this.currentFilter == "completed") obj = this.listOfTasks.filter(x => x.status == true);
        this.list.innerHTML = ""
        if (obj.length == 0) {
            this.list.innerHTML = "<h4>No task yet</h4>"
            return
        }
        obj.forEach(current => {
            let element = document.createElement('li');
            element.classList.add('view__item')
            element.innerHTML = `
            <div class="view__info">
                <input type="checkbox" class="view__checkbox" ${current.status ? 'checked' : false} id="${current.id}">
                <label for="${current.id}">${current.name}</label>
            </div>
            <div class="view__remove">
                <?xml version="1.0" encoding="utf-8"?>
                <!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17"
                        stroke="#000000" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
            `
            element.style = {
                "background": "#000"
            }
            this.watchOfInput(element, current);
            this.removeTask(element, current.id)
            this.list.append(element)
        });
    }

    addNewTask(name, description) {
        let currentId = this.listOfTasks.length >= 1 ? Math.max(...this.listOfTasks.map(task => task.id)) + 1 : 1
        let newTask = {
            id: currentId,
            name,
            description,
            status: false
        }
        this.nameInput.value = '';
        this.descriptionInput.value = '';
        this.listOfTasks.push(newTask);
        localStorage.setItem("listOfTasks", JSON.stringify(this.listOfTasks))
        this.render()
    }
    watchOfInput(element, id) {
        element.querySelector('input').addEventListener('change', e => {
            let currentTask = this.listOfTasks.find(x => x.id == e.target.id)
            currentTask.status = !currentTask.status
            this.render()
        })
    }
    removeTask(element, id) {
        element.querySelector('.view__remove').addEventListener('click', e => {
            this.listOfTasks = this.listOfTasks.filter(x => x.id != id)
            this.render()
        })
    }

}
window.onload = () => {
    let todo = new Todo()
    todo.init()

}