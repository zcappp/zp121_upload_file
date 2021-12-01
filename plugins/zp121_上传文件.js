import React from "react"

function render(ref) {
    if (!ref.props.dbf) return <div>请配置表单字段</div>
    let file = ref.getForm(ref.props.dbf)
    if (file) file = file.split("/")[file.split("/").length - 1]
    return <React.Fragment>
        <input onChange={e => onChange(ref, e)} type="file"/>
        <button onClick={e => ref.container.firstChild.click()} className="zbtn zellipsis">{svg}&nbsp;{ref.file || file || ref.props.label || "上传文件"}{ref.progress && <i>{ref.progress}</i>}</button>
    </React.Fragment>
}

function onChange(ref, e) {
    const { exc, props } = ref
    const file = e.target.files[0]
    if (!file || !file.name) return exc('warn("请选择文件文件")')
    if (file.size / 1048576 > (ref.props.max || 5)) return exc(`warn("文件太大, 请压缩至${ref.props.max || 5}M以下")`)
    ref.file = file.name
    ref.progress = "0%"
    ref.render()
    exc('upload(file, option)', {
        file,
        option: {
            onProgress: r => {
                ref.progress = r.percent + "%"
                ref.render()
            },
            onSuccess: r => {
                ref.setForm(props.dbf, r.url)
                if (props.onSuccess) exc(props.onSuccess, { ...ref.ctx, $ext: ref.ctx, ...r }, () => ref.exc("render()"))
                delete ref.progress
                delete ref.file
                ref.render()
            },
            onError: r => {
                exc(`alert("上传出错了", r.error)`, { r })
            }
        }
    })
}

const css = `
.zp121 input {
    display: none;
}
.zp121 .zbtn {
    max-width: 450px;
}
.zp121 i {
    position: absolute;
    background: darkgrey;
    left: 0;
    width: 40px;
}
`

$plugin({
    id: "zp121",
    props: [{
        prop: "dbf",
        type: "text",
        label: "表单字段"
    }, {
        prop: "onSuccess",
        type: "exp",
        label: "onSuccess表达式"
    }, {
        prop: "max",
        type: "number",
        label: "最大文件大小(单位:MB)",
        ph: "默认最大5MB"
    }, {
        prop: "label",
        type: "text",
        label: "【上传文件】文本"
    }],
    render,
    css
})

const svg = <svg className="zsvg" viewBox="64 64 896 896"><path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 0 0-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"/></svg>