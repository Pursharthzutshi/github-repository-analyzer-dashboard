interface BoxWrapperProps {
    children: React.ReactNode;
    flex?: number;
}

export default function BoxWrapper({ children, flex = 1 }: BoxWrapperProps) {
    return (
        <div style={{ flex, minWidth: 0, display: 'flex' }}>
            {children}
        </div>
    );
}
