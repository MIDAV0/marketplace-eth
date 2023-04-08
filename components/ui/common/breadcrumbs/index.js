import ActiveLink from "@components/ui/common/link"
import React from "react"

const BreadcrumbItem = ({item, index}) => {
    return (
        <li className={`${index===0 ? "pr-4" : "px-4"} font-medium text-gray-500 hover:text-gray-900`}>
            <ActiveLink href={item.href}>
                <span className="text-lg">
                    {item.value}
                </span>
            </ActiveLink>
        </li>   
    )
}

export default function Breadcrumbs({isAdmin, items}){
    return (
        <nav aria-label="breadcrumb" className="mb-4">
            <ol className="flex leading-none text-indigo-600 divide-x divide-indigo-400">
                { items.map( (item, index) => 
                    <React.Fragment key={item.href}>
                        { !item.requireAdmin &&
                            <BreadcrumbItem item={item} index={index} />  
                        }
                        {
                            item.requireAdmin && isAdmin && 
                            <BreadcrumbItem item={item} index={index} />    
                        }
                    </React.Fragment>
                    )
                }
            </ol>
        </nav>    
    )
}
