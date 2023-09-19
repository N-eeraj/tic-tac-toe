const log = (msg, type) => {
    let bgClr
    switch (type) {
        case 'info':
            bgClr = '#07F'
            break
        case 'success':
            bgClr = '#093'
            break
        case 'message':
            bgClr = '#FA0'
            break
        case 'leave':
            bgClr = '#A00'
            break
        default:
            bgClr = '#000'
    }
    console.log(`%c${msg}`, `background-color: ${bgClr}; color: #FFF; padding: 5px;`)
}

export default log
