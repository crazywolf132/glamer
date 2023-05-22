const theme = {
    layout: {
        columns: 4,
        gutter: 16,
        margin: 24
    }
}

export default (props: Record<string, any>): object => {
    const { gutter, margin, columns } = theme.layout;

    if (!props.usingLayout || !props.width || isNaN(props.width)) return {};

    const { width } = props; // This will be the device window width;

    let style: any = {};

    const widthMinusPadding = props.windowWidth - (margin * 2);
    const withoutGutters = widthMinusPadding - (gutter * (columns - 1));
    const getSingle = (_width: number) => ((withoutGutters / columns) * _width) + (gutter * (_width - 1));

    style.marginRight = style.marginLeft = (gutter / 2);
    style.width = style.minWidth = getSingle(width);

    if (props.position === 'center') {
        const leftOver = columns - width;
        const left = Math.ceil(leftOver / 2);
        const right = leftOver - left;

        style.marginLeft = style.marginLeft + getSingle(left) + gutter;
        style.marginRight = style.marginRight + getSingle(right) + gutter;

    }

    if (props.position === 'right') {
        const left = columns - width;
        style.marginLeft = style.marginLeft + getSingle(left) + gutter;
    }

    return style;
}