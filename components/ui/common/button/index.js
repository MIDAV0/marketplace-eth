
export default function Button({children, 
    className= "mr-8 text-white bg-indigo-600 hover:bg-indigo-700",
    variant = "purple",
    hoverable = true,
    ...rest
}) {

    const variants = {
        purple: `mr-8 text-white bg-purple-600 ${hoverable && "hover:bg-indigo-700"}`,
        red: `mr-8 text-white bg-red-600 ${hoverable && "hover:bg-red-700"}`,
    }

    return (
        <button 
            {...rest}
            className={`disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-8 py-3 borded text-base font-medium ${className}, ${variants[variant]}`}>
                {children}
        </button> 
    )
}