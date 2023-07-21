const Toast = document.getElementById('ui-toast')
const ToastDetails = document.getElementById('ui-toast-details')

const GetType = (type) => {
    switch (type) {
        case 'error':
            return 'ui-toast-error'
            break
        case 'success':
            return 'ui-toast-success'
            break
        default:
            return ''
            break
    }
}
const CallToast = (message, type) => {
    if (type == null || type == '');
    else Toast.classList.add(GetType(type))
    console.log(`Added classtype ${GetType(type)}`)
    ToastDetails.innerHTML = message
    console.log(`Message is: ${message}`)
    Toast.style.display = 'flex'
    console.log('Set toast display to flex')
    Toast.onclick = () => {
        console.log('Toast dismissed')
        Toast.style.animation = 'ui-fall 1s ease forwards'
        console.log('Played animation')
        setTimeout(() => {
            Toast.style.display = 'none'
            console.log('Set toast display to none')
            Toast.style.animation = ''
            if (type == null || type == '');
            else Toast.classList.remove(GetType(type))
            console.log(`Removed class ${GetType(type)}`)
            message = ''
            console.log('Reset message variable')
            type = ''
            console.log('Reset type variable')
        }, 1000)
    }
}