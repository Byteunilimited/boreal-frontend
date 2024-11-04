export const Image = ({ props }) => {
    let { style, src, alt = 'Alt image' } = props || {};

    return (
        <img
            className={`${style || ''}Image`}
            src={src}
            alt={alt}
        />
    );
}
