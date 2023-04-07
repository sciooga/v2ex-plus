chrome.storage.sync.get("options", async (data) => {
    let replies = []
    // 通过 HTML 解析当前页的回复数据（接口返回的数据偶尔滞后，会导致最后一页数据不完整）
    document.querySelectorAll('.no').forEach(el => {
        let noNum = el.innerText - 1
        let cell = el.closest('.cell')
        replies[noNum] = {
            member: {
                created: 0,
                username: cell.querySelector('.avatar').alt
            },
            content_rendered: cell.querySelector('.reply_content').innerHTML
        }
    })

    // 获取帖子所有回复
    let url = "/api/replies/show.json?topic_id=" + /\/t\/([0-9]+)/.exec(window.location.href)[1]
    let rep = await fetch(url)
    let allReplies = await rep.json()
    allReplies.map((i, idx) => {
        replies[idx] = i
    })

    let replyContent = document.querySelector("#reply_content")
    replyContent.placeholder = '您可以在回复框内直接粘贴图片或拖拽图片文件至回复框内上传'

    // 主题、回复超长折叠
    if (data.options.fold) {
        let topic = document.querySelector('#Main > div:nth-of-type(2)')
        if (topic.offsetHeight >= 1800) {
            let topicContent = topic.querySelector('.cell .topic_content')
            topicContent.style.maxHeight = '600px'
            topicContent.style.overflow = 'hidden'
            document.querySelectorAll('.subtle').forEach(el => {
                el.style.display = 'none'
            })

            let btn = document.createElement('button')
            btn.innerText = '展开主题'
            btn.style.margin = '50px calc(50% - 3em)'
            topicContent.after(btn)

            btn.addEventListener('click', e => {
                topicContent.style.maxHeight = ''
                document.querySelectorAll('.subtle').forEach(el => {
                    el.style.display = ''
                })
                btn.remove()
            })
        }

        document.querySelectorAll('div[id^=r_] .reply_content').forEach(el => {
            el.classList.add('flod')
        })
    }

    // 翻页跳过主题
    if (data.options.jump) {
        if (document.referrer.indexOf(document.location.pathname) != -1) {
            document.querySelector('.topic_buttons').scrollIntoView()
        }
    }

    // 回复楼层号
    if (data.options.replyUserNum) {
        document.querySelectorAll(("[alt=\"Reply\"]")).forEach((el) => {
            el.onclick = (e) => {
                setTimeout(() => {
                    let cell = el.closest('.cell')
                    let no = cell.querySelector('.no')
                    let noNum = +no.innerText
                    prefix = `#${noNum} `

                    replyContent.value += prefix
                    replyContent.focus()
                }, 50)
            }
        })
    }

    // 楼主回复背景色
    let r = parseInt((data.options.replyColor).substring(1, 3), 16),
        g = parseInt((data.options.replyColor).substring(3, 5), 16),
        b = parseInt((data.options.replyColor).substring(5, 7), 16),
        replyColor = `${r},${g},${b},${data.options.replyA}`
    document.querySelectorAll('.badge.op').forEach((el) => {
        let cell = el.closest('.cell')
        cell.style.background = `rgba(${replyColor})`
    })

    // 高亮被标记用户
    data.options.userMarkList.map((item) => {
        document.querySelectorAll(`img[alt="${item}"]`).forEach(el => {
            el.style.outline = '3px solid red'
        })
    })

    // 感谢爱心颜色
    document.querySelectorAll('.cell .small.fade').forEach((el) => {
        el.style.color = data.options.thankColor
    })

    let replyHead = document.querySelector('#reply-box .flex-one-row div:nth-child(1)')
    // 回复表情
    let emotBtn = document.createElement('a')
    emotBtn.innerText = ' ᕀ 表情'
    replyHead.append(emotBtn)
    let emotUl = document.createElement('ul')
    emotUl.classList.add('emoticon')
    emotUl.style.display = 'none'
    // 十六进制为 Emoji 所对应的 Unicode 编码
    for (let i = 0x1F601; i <= 0x1F64F; i++) {
        let emotLi = document.createElement('li')
        emotLi.innerHTML = "&#x" + i.toString(16)
        emotUl.append(emotLi)
        emotLi.addEventListener('click', () => {
            // 光标处插入文本
            let insert = replyContent.selectionStart
            replyContent.value = replyContent.value.substr(0, insert) + emotLi.innerHTML + replyContent.value.substr(insert)
            // replyContent.focus()
        })
    }
    document.querySelector('#reply-box').prepend(emotUl)
    emotBtn.addEventListener('click', (e) => {
        if (emotUl.style.display) {
            emotUl.style.display = null
        } else {
            emotUl.style.display = 'none'
        }
    })

    // 上传图片
    let imgBtn = document.createElement('a')
    imgBtn.innerText = ' ᕀ 插入图片'
    replyHead.append(imgBtn)
    let imgInput = document.createElement('input')
    imgInput.style.display = 'none'
    imgInput.type = 'file'
    imgInput.accept = 'image/*'
    replyHead.append(imgInput)
    imgBtn.addEventListener('click', (e) => {
        imgInput.click()
    })
    // 点击按钮选择上传图片
    imgInput.addEventListener('change', (e) => {
        var files = e.target.files || (e.dataTransfer && e.dataTransfer.files);
        if (files) {
            let file = files[0]
            uploadImg(file)
        } else {
            alert("没有获取到文件。")
        }
    })
    // 剪切板上传图片
    document.body.addEventListener("paste", function (e) {
        for (let i = 0; i < e.clipboardData.items.length; ++i) {
            let item = e.clipboardData.items[i]
            if (item.kind == "file" && /image\/\w+/.test(item.type)) {
                let file = item.getAsFile()
                uploadImg(file)
                //阻止原有的粘贴事件以屏蔽文字
                e.preventDefault()
                //只黏贴一张图片
                break
            }
        }
    })
    // 拖转上传图片
    replyContent.addEventListener("drop", (e) => {
        let file = e.dataTransfer.files[0]
        uploadImg(file)
        e.preventDefault()
    })
    function uploadImg(file, callback) {
        document.body.style.cursor = 'progress'
        let reader = new FileReader()
        reader.onload = async function () {

            // 随机抽取一个 imgur 的 key
            let client_id = [
                "442b04f26eefc8a",
                "59cfebe717c09e4",
                "60605aad4a62882",
                "6c65ab1d3f5452a",
                "83e123737849aa9",
                "9311f6be1c10160",
                "c4a4a563f698595",
                "81be04b9e4a08ce"
            ].sort(() => 0.5 - Math.random())[0]

            let data = new FormData()
            data.append('image', this.result.match("base64,(.*)")[1])

            let rep = await fetch('https://api.imgur.com/3/image', {
                method: 'POST',
                headers: {
                    'Authorization': "Client-ID " + client_id
                },
                body: data
            })
            let url = (await rep.json())['data']['link']

            let insert = replyContent.selectionStart
            replyContent.value = replyContent.value.substr(0, insert) + ` ${url} ` + replyContent.value.substr(insert)
            document.body.style.cursor = ''
        }
        reader.readAsDataURL(file)
    }

    // 悬浮@用户查看最近回复
    if (data.options.relateReply) {
        document.querySelectorAll('.reply_content a').forEach((el) => {
            let username = RegExp("/member/(.+)").exec(el.href)
            if (!username) return
            username = username[1]
            let cell = el.closest('.cell')
            let btn = document.createElement('a')
            btn.classList.add('thank')
            btn.href = '#;'
            btn.innerText = '会话详情'
            let thankArea = cell.querySelector('.thank_area')
            if (!thankArea) {
                let fr = cell.querySelector('.fr')
                thankArea = document.createElement('div')
                thankArea.classList = 'thank_area'
                fr.prepend(thankArea)
            }
            thankArea.append(' \u00A0 \u00A0 ', btn)
            btn.addEventListener('click', () => {
                let wrapper = document.createElement('div')
                wrapper.classList.add('wrapper')
                wrapper.innerHTML = '<div class="btn close">✕</div>'

                let selfUsername = cell.querySelector('.avatar').alt
                replies.map((i, idx) => {
                    let sign = [selfUsername, username].indexOf(i['member']['username'])
                    if (sign == -1) return
                    let reply = document.createElement('div')
                    reply.classList.add('reply')
                    reply.innerHTML = i['content_rendered']
                    reply.innerHTML += `<div class="relateReplyInfo">${i['member']['username']} 回复于${idx + 1}层</div>`
                    wrapper.append(reply)
                    if (sign == 1) {
                        reply.style.float = 'left'
                    }
                    if (i['content_rendered'].indexOf('@') != -1) {
                        if (i['content_rendered'].indexOf(selfUsername) == -1) {
                            if (i['content_rendered'].indexOf(username) == -1) {
                                reply.style.opacity = 0.3
                            }
                        }
                    }
                })

                Array().forEach.call(document.body.children, el => el.style.filter = 'blur(6px)')
                document.body.append(wrapper)
                document.querySelector('.close').addEventListener('click', () => {
                    wrapper.remove()
                    Array().forEach.call(document.body.children, el => el.style.filter = '')
                })
            })
            el.addEventListener('mouseenter', (e) => {
                if (el.dataset.isPopup) return clearTimeout(el.dataset.hidePopup)
                el.dataset.isPopup = true
                let content = '未找到相关回复'
                let noNum = -1 // 初始化负一

                // 如果有 #楼层号 则先判断楼层号是否为相关回复优先显示
                let hashtag = RegExp(" #(\\d+)").exec(el.nextSibling.data)
                if (hashtag) {
                    let hashtagNum = +hashtag[1] - 1
                    if (replies[hashtagNum]['member']['username'] == username) {
                        noNum = hashtagNum
                    }
                } else {
                    noNum = +cell.querySelector('.no').innerText
                    while (--noNum) {
                        if (replies[noNum]['member']['username'] == username) break
                    }
                }
                if (noNum >= 0) {
                    content = replies[noNum].content_rendered
                    content += `<div class="relateReplyInfo"><a>查看双方对话</a>${username} 回复于${noNum + 1}层</div>`
                }

                // 显示弹框
                let relateReply = document.createElement('div')
                relateReply.classList.add("relateReply")
                relateReply.innerHTML = content
                cell.prepend(relateReply)
                relateReply.style.top = e.target.getBoundingClientRect().top + document.documentElement.scrollTop - relateReply.offsetHeight + 'px'
                relateReply.style.left = e.target.getBoundingClientRect().left + document.documentElement.scrollLeft - 30 + 'px'
                relateReply.style.opacity = 1
                relateReply.style.marginTop = '-8px'

                document.querySelector('.relateReplyInfo a').addEventListener('click', () => {
                    btn.click()
                })

                relateReply.addEventListener('mouseenter', (e) => {
                    clearTimeout(el.dataset.hidePopup)
                })
                relateReply.addEventListener('mouseleave', hidePopup)
            })

            function hidePopup() {
                el.dataset.hidePopup = setTimeout(() => {
                    delete el.dataset.isPopup
                    document.querySelector('.relateReply').remove()
                }, 100)
            }

            el.addEventListener('mouseleave', hidePopup)
        })
    }

    if (data.options.nestedComment) {
        document.querySelectorAll('div[id^=r_]').forEach(el => {
            let nestedUser = el.querySelectorAll('.reply_content a[href^="/member"]')
            nestedUser = Array().map.call(nestedUser, i => i.innerText)
            if (!nestedUser.length) return

            let nestedComment = document.createElement('div')
            nestedComment.classList.add('nested')
            el.append(nestedComment)

            let selfUsername = el.querySelector('.avatar').alt
            nestedUser.unshift(selfUsername)

            replies.map((i, idx) => {
                let sign = nestedUser.indexOf(i['member']['username'])
                if (sign == -1) return
                // 有 @ 用户但不是 @ 相关用户
                if (i['content_rendered'].indexOf('@<a') != -1) {
                    let sign = false
                    nestedUser.forEach(username => {
                        sign = i['content_rendered'].indexOf(username) != -1
                    })
                    if (!sign) return
                }

                let comment = document.createElement('div')
                comment.classList.add('comment', `comment_${i['member']['username']}`)
                comment.innerHTML = `
                    <div>
                        <img class="avatar" src="${i['member']['avatar_large']}">
                    </div>
                    <div class='comment_content'>
                        <p>${i['member']['username']}<span class="no">${idx + 1}</span></p>
                        <div class='reply_content'>${i['content_rendered']}</div>
                    </div>
                `
                nestedComment.append(comment)

                comment.addEventListener('mouseenter', () => {
                    el.querySelectorAll(`.comment_${i['member']['username']} .avatar`).forEach(el => {
                        el.style.outline = '2px solid OrangeRed'
                    })
                })

                comment.addEventListener('mouseleave', () => {
                    el.querySelectorAll(`.comment_${i['member']['username']} .avatar`).forEach(el => {
                        el.style.outline = '0px solid OrangeRed'
                    })
                })
            })
        })
    }

    if (data.options.weekNewuser) {
        replies.map(i => {
            let monthAgo = +new Date / 1000 - 30 * 24 * 60 * 60
            if (i['member']['created'] < monthAgo) return
            document.querySelectorAll(`img[alt="${i['member']['username']}"]`).forEach(el => {
                el.closest('.cell').style.opacity = .2
            })
        })
    }

    // 解析老图片，将 http 地址改为 https
    // 微博图片在 manifest.json 内修改 referer
    document.querySelectorAll('img[src^="http:"]').forEach(el => {
        el.src = el.src.replace('http', 'https')
    })
})