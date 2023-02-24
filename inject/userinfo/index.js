chrome.storage.sync.get("options", (data) => {
    if (data.options.userinfo) {
        document.querySelectorAll('.avatar').forEach((el) => {
            // TODO 函数去抖
            el.addEventListener('mouseenter', async (e) => {
                if (el.dataset.isPopup) return clearTimeout(el.dataset.hidePopup)
                el.dataset.isPopup = true
                el.style.cursor = 'wait'
                if (el.parentElement.href) {
                    username = el.parentElement.href.split('/')[4]
                } else {
                    username = el.closest('.cell').querySelector('strong a').innerText
                }

                let rep = await fetch(`https://www.v2ex.com/member/${username}`)
                let text = await rep.text()

                // 解析用户信息
                let avatarUrl = el.src
                let id = RegExp("V2EX 第 ([0-9]+?) 号会员").exec(text)[1]
                let location = RegExp("maps\\?q=(.+?)\"").exec(text)
                let created = RegExp("加入于 (.+?) ").exec(text)[1]
                let tagline = RegExp("bigger\">(.+?)</span>").exec(text)
                let website = RegExp("\"(.+?)\".*?alt=\"Website.*?&nbsp(.+?)<").exec(text)
                let companyAndJob = RegExp("<span>🏢&nbsp; <strong>(.*?)</strong> / (.*?)</span>").exec(text)
                let online = RegExp("ONLINE").exec(text)
                let btn_once = RegExp("/([0-9]+?\\?once=[0-9]+?)'").exec(text)
                let isFollow = !RegExp("加入特别关注").test(text)
                let isBlock = !RegExp("Block").test(text)
                let isMark = data.options.userMarkList.includes(username)

                if (!el.dataset.isPopup) return
                // 显示弹框
                let userinfo = document.createElement('div')
                userinfo.classList.add("userinfo")
                let userAvatar = document.createElement('img')
                let userDesc = document.createElement('p')
                userDesc.classList.add("userdesc")
                let userTag = document.createElement('p')
                let userFollow = document.createElement('input')
                let userBlock = document.createElement('input')
                let userMark = document.createElement('input')
                userFollow.type = 'button'
                userBlock.type = 'button'
                userMark.type = 'button'
                userFollow.classList.add('super', 'special', 'button')
                userBlock.classList.add('super', 'normal', 'button')
                userMark.classList.add('super', 'normal', 'button')

                userinfo.append(userAvatar)
                userinfo.append(userDesc)
                userinfo.append(userTag)
                userinfo.append(userFollow)
                userinfo.append(userBlock)
                userinfo.append(userMark)
                document.body.append(userinfo)

                userAvatar.src = avatarUrl
                userDesc.innerHTML = `${username} ${id} 号会员<br>`
                userDesc.innerHTML += `${online ? '在线' : '离线'} 加入于 ${created}`

                if (location) {
                    userTag.innerHTML += `${location[1]}<br>`
                }
                if (tagline) {
                    userTag.innerHTML += `${tagline[1]}<br>`
                }
                if (companyAndJob) {
                    userTag.innerHTML += `${companyAndJob[1]} ${companyAndJob[2]}<br>`
                }
                if (website) {
                    userTag.innerHTML += `${website[1]}<br>`
                }
                userFollow.value = isFollow ? '取消' : '关注'
                userBlock.value = isBlock ? '取消' : '屏蔽'
                userMark.value = isMark ? '取消' : '标记'

                el.style.cursor = ''
                userinfo.style.top = e.target.getBoundingClientRect().top + document.documentElement.scrollTop - userinfo.offsetHeight + 'px'
                userinfo.style.left = e.target.getBoundingClientRect().left + document.documentElement.scrollLeft - 80 + 'px'
                userinfo.style.opacity = 1
                userinfo.style.marginTop = '-8px'

                userinfo.addEventListener('mouseenter', (e) => {
                    clearTimeout(el.dataset.hidePopup)
                })
                userinfo.addEventListener('mouseleave', hidePopup)

                userFollow.addEventListener('click', async () => {
                    userFollow.value = '稍后'
                    await fetch(`/${isFollow ? 'unfollow' : 'follow'}/${btn_once[1]}`)
                    isFollow = !isFollow
                    userFollow.value = isFollow ? '取消' : '关注'
                })

                userBlock.addEventListener('click', async () => {
                    userBlock.value = '稍后'
                    await fetch(`/${isBlock ? 'unblock' : 'block'}/${btn_once[1]}`)
                    isBlock = !isBlock
                    userBlock.value = isBlock ? '取消' : '屏蔽'
                    window.location.reload()
                })

                userMark.addEventListener('click', () => {
                    let options = data.options
                    if (isMark) {
                        options.userMarkList = options.userMarkList.filter(item => item != username)
                    } else {
                        options.userMarkList.push(username)
                    }
                    chrome.storage.sync.set({ options })
                    isMark = !isMark
                    userMark.value = isMark ? '取消' : '标记'
                    window.location.reload()
                })
            })

            function hidePopup() {
                el.dataset.hidePopup = setTimeout(() => {
                    delete el.dataset.isPopup
                    document.querySelector('.userinfo').remove()
                }, 100)
            }

            el.addEventListener('mouseleave', hidePopup)
        })
    }
})