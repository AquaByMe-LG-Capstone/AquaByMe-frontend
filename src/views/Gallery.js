/* eslint-disable */
import { VirtualGridList } from '@enact/sandstone/VirtualList';
import BodyText from '@enact/sandstone/BodyText';
const Gallery = () => {
    const itemRenderer = ({ index, ...rest }) => {
        const colors = ["red", "blue", "green", "orange", "purple"]; // Add more colors as needed
        const color = colors[index % colors.length]; // Cycle through colors based on index

        return (
            <div
                {...rest}
                style={{
                    backgroundColor: color,
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontSize: "16px",
                }}
            >
                {`Item ${index}`}
            </div>
        );
    };

    return (
        <>
            <BodyText
                size="large">
                This will be the gallery page
            </BodyText>

            <VirtualGridList
                dataSize={1000}
                direction="vertical"
                horizontalScrollbar="auto"
                itemRenderer={itemRenderer}
                itemSize={{
                    minHeight: 190,
                    minWidth: 229.33333333333331
                }}
                onScrollStart={function noRefCheck() { }}
                onScrollStop={function noRefCheck() { }}
                scrollMode="native"
                spacing={0}
                verticalScrollbar="auto"
            />
        </>
    );
};

export default Gallery;