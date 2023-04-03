import Image from 'next/image'
import Link from 'next/link'

export default function CourseCard({course, Footer, disabled}){
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <div className="flex h-full">
                <div className="flex-1 h-full">
                    <Image 
                        className={`object-cover ${disabled && 'filter grayscale'}`}
                        src={course.coverImage} 
                        layout="responsive"
                        width="200"
                        height="230"
                        alt={course.title}
                        />
                </div>
                <div className="p-8 flex-1">
                    <div className="uppercase tracking-wide text-base text-indigo-500 font-semibold">{course.type}</div>
                    <Link href={`/courses/${course.slug}`} className="block mt-1 text-sm xs:text-lg leading-tight font-medium text-black hover:underline">
                            {course.title}
                    </Link>
                    <p className="mt-2 text-sm xs:text-base text-gray-500">{course.description}</p>
                    {   Footer &&
                        <Footer />
                    }
                </div>
            </div>
        </div>
    )
}