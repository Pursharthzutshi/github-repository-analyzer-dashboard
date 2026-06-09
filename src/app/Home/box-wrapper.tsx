export default function BoxWrapper({ flex,children }: { flex?: number; children: React.ReactNode }) {
    return(
        <div className="box-wrapper" style={{flex:flex}}>
            {children}
        </div>
    )
}