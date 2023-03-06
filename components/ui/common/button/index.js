
export default function Button({children, 
    className= "mr-8 text-white bg-indigo-600 hover:bg-indigo-700",
    ...rest
}) {

    return (
        <button 
            {...rest}
            className={`disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-8 py-3 borded text-base font-medium ${className}`}>
                {children}
        </button> 
    )
}