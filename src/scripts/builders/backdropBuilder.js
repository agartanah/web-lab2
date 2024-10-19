export default function backdropBuilder() {
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');

    document.body.appendChild(backdrop);

    return backdrop;
}