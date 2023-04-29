
const SIZE = {
    sm: "p-2 text-base xs:px-4",
    md: "p-3 text-base xs:px-8",
    lg: "p-3 text-lg xs:px-8",
}

export default function Button({children, 
    className= "mr-8 text-white bg-indigo-600 hover:bg-indigo-700",
    variant = "purple",
    size = "md",
    hoverable = true,
    ...rest
}) {

    const sizeClass = SIZE[size]
    const variants = {
        purple: `mr-8 text-white bg-purple-600 ${hoverable && "hover:bg-indigo-700"}`,
        red: `mr-8 text-white bg-red-600 ${hoverable && "hover:bg-red-700"}`,
        lightBlue: `text-indigo-100 bg-indigo-000 ${hoverable && "hover:bg-indigo-200"}`,
        white: `bg-white text-black`,
    }

    return (
        <button 
            {...rest}
            className={`${sizeClass} disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-8 py-3 borded font-medium ${className}, ${variants[variant]}`}>
                {children}
        </button> 
    )
}