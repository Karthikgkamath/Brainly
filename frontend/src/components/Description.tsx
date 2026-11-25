interface DescriptionInterface{
    reference:React.RefObject<HTMLTextAreaElement | null>
    
}

export function Description({reference}:DescriptionInterface) {
    return (
        <textarea
            placeholder="Enter the description for the content"
            className="border-2 rounded-md px-4 py-2 w-full" ref={reference}
        />
    );
}