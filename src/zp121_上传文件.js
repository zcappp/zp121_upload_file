import React from "react"

function render(ref) {
    let { dbf, form } = ref.props
    let file
    if (form) {
        ref.form = typeof form == "string" ? ref.excA(form) : form
        if (typeof ref.form == "object") file = ref.form[dbf]
    } else if (ref.getForm) {
        file = ref.getForm(dbf)
    }
    return <React.Fragment>
        <input onChange={e => onChange(ref, e)} type="file"/>
        <button onClick={e => ref.container.firstChild.click()} className="zbtn zellipsis">
            {svg}&nbsp;{ref.file || (file ? file.split("/")[file.split("/").length - 1] : "") || ref.props.label || "上传文件"}
            {ref.progress && <i>{ref.progress}</i>}
            {file && <a href={file} onClick={e => e.stopPropagation()} target="_blank" className="zarrow zhover"/>}
            {file && <span onClick={e => {e.stopPropagation(); ref.form ? delete ref.form[dbf] : ref.setForm(dbf, ""); ref.exc('render()')}} className="zdel zhover"/>}
        </button>
    </React.Fragment>
}

function onChange(ref, e) {
    const { exc, props } = ref
    const file = e.target.files[0]
    if (!file || !file.name) return exc('warn("请选择文件文件")')
    if (file.size / 1048576 > (props.max || 5)) return exc(`warn("文件太大, 请压缩至${props.max || 5}M以下")`)
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
                ref.form ? ref.form[props.dbf] = r.url : ref.setForm(props.dbf, r.url)
                if (props.onSuccess) exc(props.onSuccess, { ...ref.ctx, $ext_ctx: ref.ctx, $val: r.url, ...r }, () => ref.exc("render()"))
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
.zp121 .zsvg {
    color: gray;
}
.zp121 i {
    position: absolute;
    background: darkgrey;
    left: 0;
    width: 40px;
}
.zp121 .zhover {
    color: silver;
}
.zp121 .zdel {
    padding: .5em 0;
}
.zdesktop .zp121 .zhover {
    display: none;
}
.zdesktop .zp121:hover .zhover {
    display: inline-flex;
}
`

$plugin({
    id: "zp121",
    props: [{
        prop: "dbf",
        label: "字段名",
        ph: "必填"
    }, {
        prop: "form",
        label: "字段容器",
        ph: "如不填则使用祖先节点的表单容器"
    }, {
        prop: "max",
        type: "number",
        label: "最大文件大小(单位:MB)",
        ph: "默认最大5MB"
    }, {
        prop: "label",
        label: "[上传文件] 文本"
    }, {
        prop: "onSuccess",
        type: "exp",
        label: "上传成功表达式",
        ph: "$val"
    }],
    render,
    css
})

const svg = <svg className="zsvg" viewBox="64 64 896 896"><path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 0 0-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"/></svg>