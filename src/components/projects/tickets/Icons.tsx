export const LowPriorityIcon = ({...props}) => (
    <svg width="20" height="20" viewBox="0 0 20 5" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="15" height="3" rx="2.5" fill="#00AF55"/>
    </svg>
);

export const MediumPriorityIcon = ({...props}) => (
    <svg width="20" height="20" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="20" height="3" rx="2.5" fill="#FF9800" y="2"/>
        <rect y="10" width="20" height="3" rx="2.5" fill="#FF9800"/>
    </svg>
);

export const HighPriorityIcon = ({...props}) => (
    <svg width="20" height="20" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect y="7" width="15" height="3" rx="1.5" fill="#B72136"/>
        <rect width="15" height="3" rx="1.5" fill="#B72136"/>
        <rect y="14" width="15" height="3" rx="1.5" fill="#B72136"/>
    </svg>
);

export const CriticalPriorityIcon = ({...props}) => (
    <svg width="20" height="20" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="17" height="17" rx="8.5" fill="#B72136"/>
        <rect x="7.3667" y="2.26666" width="2.26667" height="8.5" rx="1.13333" fill="white"/>
        <rect x="7.3667" y="12.4667" width="2.26667" height="2.26667" rx="1.13333" fill="white"/>
    </svg>
);

export const AddIcon = ({...props}) => (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.75 16.25H16.25V23.75H13.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25Z" fill="black"/>
        <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="black"/>
    </svg>
)