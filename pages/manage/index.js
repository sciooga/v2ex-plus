let title = document.querySelector('h2')
let orginUrl = window.location.origin
if (location.search == '?highlight') {
    title.innerText = '高亮用户列表'
    chrome.storage.sync.get("options", async (data) => {
        if (!data.options.userMarkList.length) return document.body.append('无高亮用户')
        data.options.userMarkList.map((username) => {
            fetch(orginUrl + "/api/members/show.json?username=" + username)
                .then(rep => rep.json())
                .then(userinfo => {
                    let avatar = document.createElement('img')
                    avatar.src = userinfo.avatar_large
                    let username = document.createElement('p')
                    username.innerText = userinfo.username
                    let btn = document.createElement('input')
                    btn.type = 'button'
                    btn.value = '取消'
                    btn.addEventListener('click', (e) => {
                        console.log(data)
                        let options = data.options
                        options.userMarkList = options.userMarkList.filter(item => item != userinfo.username)
                        chrome.storage.sync.set({ options })
                        e.preventDefault()
                        location.reload()
                        return false
                    })


                    let wrapper = document.createElement('a')
                    wrapper.target = '_blank'
                    wrapper.href = userinfo.url
                    wrapper.append(avatar)
                    wrapper.append(username)
                    wrapper.append(btn)
                    document.body.append(wrapper)
                })
        })
    })
}

if (location.search == '?blockuser') {
    title.innerText = '屏蔽用户列表'
    fetch(orginUrl)
        .then(rep => rep.text())
        .then(text => {
            let blockList = /blocked = \[(.*?)\];/.exec(text)
            if (!blockList[1]) return document.body.append('无屏蔽用户')
            blockList = blockList[1].split(',')
            console.log(blockList)
            blockList.map(i => {
                fetch(orginUrl + "/api/members/show.json?id=" + i)
                    .then(rep => rep.json())
                    .then(userinfo => {
                        let avatar = document.createElement('img')
                        avatar.src = userinfo.avatar_large
                        let username = document.createElement('p')
                        username.innerText = userinfo.username
                        let wrapper = document.createElement('a')
                        wrapper.target = '_blank'
                        wrapper.href = userinfo.url

                        wrapper.append(avatar)
                        wrapper.append(username)
                        document.body.append(wrapper)
                    })
            })
        })
}

if (location.search == '?ignoretopic') {
    title.innerText = '忽略主题列表'

    fetch(orginUrl)
        .then(rep => rep.text())
        .then(text => {
            let ignoreList = /ignored_topics = \[(.*?)\];/.exec(text)
            if (!ignoreList[1]) return document.body.append('无忽略主题')
            ignoreList = ignoreList[1].split(',')
            console.log(ignoreList)
            ignoreList.map(i => {
                fetch(orginUrl + "/api/topics/show.json?id=" + i)
                    .then(rep => rep.json())
                    .then(toppicInfo => {
                        toppicInfo = toppicInfo[0]
                        console.log(toppicInfo)
                        let title = document.createElement('p')
                        title.innerText = toppicInfo.title

                        let wrapper = document.createElement('a')
                        wrapper.target = '_blank'
                        wrapper.href = toppicInfo.url

                        wrapper.append(title)
                        document.body.append(wrapper)
                    })
            })
        })
}