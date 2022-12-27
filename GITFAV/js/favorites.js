export class GitHubUser {
    static Search(username) {
        let endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(data => data.json())
        .then(data => ({
            login: data.login,
            name: data.name,
            public_repos: data.public_repos,
            followers: data.followers
        }))
    }}

export class FavoritesData {
    constructor (root) {
        this.root = document.querySelector(root)
        this.load()
    }
    load () {
        this.entries = JSON.parse(localStorage
            .getItem('github-favorites:')) || []
    }
    async add (username) {
        try {
            let UserExist = this.entries.find(entry => entry.login === username)
            if (UserExist) {
                throw new Error('Usuário já cadastrado' )
            }

            let user = await GitHubUser.Search(username)

            if (user.login === undefined) {
            throw new Error('Usuário não encontrado')
        }
        
        this.entries = [user, ...this.entries]
        this.update()
        this.save()
    } catch (error) {
        alert(error.message)}

    }
    save () {
        localStorage.setItem('github-favorites:', JSON.stringify(this.entries))
    }
    delete (user) {
        let FilterEntries = this.entries.filter(entry => 
            entry.login !== user.login)
        this.entries = FilterEntries
        this.update()
        this.save()
    }
}
export class FavoritesVisual extends FavoritesData {
    constructor (root) {
        super(root )

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    update() {
        this.removeall()

        this.entries.forEach(user => {
            let row = this.createrow()
            row.querySelector('.UserInfo img').src = `https://github.com/${user.login}.png`
            row.querySelector('.UserInfo a').href = `https://github.com/${user.login}`
            row.querySelector('.UserInfo p').textContent = user.name
            row.querySelector('.UserInfo span').textContent = user.login
            row.querySelector('.repos').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.RemoveItem').addEventListener('click',  () => {
                let IsOK = confirm('Tem certeza que deseja deletar?')

                if (IsOK) {
                    this.delete(user)
                }
            })

            this.tbody.append(row)

            this.root.querySelector('.nocontent').classList.add('noview')
         })
    }
    onadd() {
        let AddButton = this.root.querySelector('.SearchButton')
        
        AddButton.addEventListener('click', () => {
            let InputData = this.root.querySelector('.SearchTool input').value

            this.add(InputData)
        })
    }

    removeall () {

        this.tbody.querySelectorAll('tr').forEach(element => {
            element.remove()
        });

        this.root.querySelector('.nocontent').classList.remove('noview')
    }

    createrow () {
        let Row = document.createElement('tr')

        let RowData = `<td class="UserInfo">
            <img src="https://github.com/maykbrito.png" alt="">
            <a href="https://github.com/maykbrito" target="_blank">
                <p>Mayk Brito</p>
                <span>/maykbrito</span>
            </a>
        </td>
        <td class="repos">22</td>
        <td class="followers">12</td>
        <td class="RemoveItem">Remove</td>`

        Row.innerHTML = RowData

        return Row
    }
} 