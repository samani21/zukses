import React from 'react'

interface IconProps {
    className?: string;
}

export const ArrowLeftIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></g>
    </svg>
);
export const ProfilIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path fill="currentColor" d="M20 22h-2v-2a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v2H4v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5zm-8-9a6 6 0 1 1 0-12a6 6 0 0 1 0 12m0-2a4 4 0 1 0 0-8a4 4 0 0 0 0 8" />
    </svg>
);
export const PinIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path fill="currentColor" d="M12 2a8 8 0 0 0-8 7.92c0 5.48 7.05 11.58 7.35 11.84a1 1 0 0 0 1.3 0C13 21.5 20 15.4 20 9.92A8 8 0 0 0 12 2m0 17.65c-1.67-1.59-6-6-6-9.73a6 6 0 0 1 12 0c0 3.7-4.33 8.14-6 9.73" /><path fill="currentColor" d="M12 6a3.5 3.5 0 1 0 3.5 3.5A3.5 3.5 0 0 0 12 6m0 5a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 12 11" />
    </svg>
);
export const CardIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path fill="currentColor" fill-rule="evenodd" d="M19.184 4.912L12 4.75l-7.184.162a2.81 2.81 0 0 0-2.699 2.3a26.5 26.5 0 0 0 0 9.575a2.81 2.81 0 0 0 2.7 2.3L12 19.25l7.184-.162a2.81 2.81 0 0 0 2.699-2.3c.581-3.166.581-6.41 0-9.575a2.81 2.81 0 0 0-2.7-2.3M4.85 6.412L12 6.25l7.15.162c.62.014 1.145.461 1.257 1.072q.23 1.252.332 2.516H3.26q.101-1.264.332-2.516A1.31 1.31 0 0 1 4.85 6.412M3.181 12c0 1.512.137 3.023.412 4.516c.112.61.637 1.058 1.257 1.072l7.15.162l7.15-.162a1.31 1.31 0 0 0 1.257-1.072c.275-1.493.412-3.004.412-4.516z" clip-rule="evenodd" />
    </svg>
);
export const CartIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"><circle cx="9.549" cy="19.049" r="1.701" /><circle cx="16.96" cy="19.049" r="1.701" /><path d="m5.606 5.555l2.01 6.364c.309.978.463 1.467.76 1.829c.26.32.599.567.982.72c.435.173.947.173 1.973.173h3.855c1.026 0 1.538 0 1.972-.173c.384-.153.722-.4.983-.72c.296-.362.45-.851.76-1.829l.409-1.296l.24-.766l.331-1.05a2.5 2.5 0 0 0-2.384-3.252zm0 0l-.011-.037a7 7 0 0 0-.14-.42a2.92 2.92 0 0 0-2.512-1.84C2.84 3.25 2.727 3.25 2.5 3.25" /></g>
    </svg>
);

export const UserCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

export const CreditCardIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 21Z" />
    </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
    </svg>
);

export const StoreIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.25m11.25 0h8.25m-11.25 0V11.25a.75.75 0 0 0-.75-.75H9.75a.75.75 0 0 0-.75.75V21m-4.5 0H2.25m9 0V3.75a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0h.008v.008H11.25v-.008Z" />
    </svg>
);

export const WalletIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"><path d="M7.36 13.855a.33.33 0 0 0-.4-.24H4.885a4.4 4.4 0 0 0-1.537.26a.28.28 0 0 0-.232.225a.3.3 0 0 0 .003.114a.28.28 0 0 0 .329.24a6 6 0 0 1 1.198.239q.289.024.579 0q.297-.002.589-.06q.673-.136 1.307-.4a.34.34 0 0 0 .24-.379m8.513 2.626a4.6 4.6 0 0 0-1.657-.06c0-.22-.05-.44-.08-.66c-.05-.398-.12-.788-.18-1.187h1.218a.28.28 0 0 0 .32-.25a.29.29 0 0 0-.25-.329l-1.177-.09h-.2c0-.27-.08-.529-.11-.798a.3.3 0 0 0-.294-.354a.3.3 0 0 0-.295.354c0 .3 0 .599-.05.898a4.6 4.6 0 0 0-2.126.929a1.43 1.43 0 0 0-.36 1.696c.16.35.44.63.79.789a3.1 3.1 0 0 0 1.387.24h.429c0 .18 0 .359.07.529c.07.399.16.798.24 1.187h-.53a4.3 4.3 0 0 1-2.016-.778a.334.334 0 0 0-.42.519a5.3 5.3 0 0 0 2.347.998c.289.05.579.07.858.09l.15.619a.33.33 0 0 0 .379.28a.34.34 0 0 0 .28-.39v-.52q.475-.02.938-.139a3.1 3.1 0 0 0 1.567-.998a1.39 1.39 0 0 0 .17-1.527a1.94 1.94 0 0 0-1.398-1.048m-3.124.09a2.2 2.2 0 0 1-.769-.05a.66.66 0 0 1-.449-.3c-.19-.37 0-.649.35-.878a4.1 4.1 0 0 1 1.207-.57v1.767zm3.324 1.996a2.4 2.4 0 0 1-.889.549q-.36.12-.738.16c0-.42 0-.839-.08-1.258v-.52q.474-.036.948 0a1.1 1.1 0 0 1 .998.52c.02.21-.09.4-.24.569z" /><path d="M20.576 16.12a5.4 5.4 0 0 0-.71-1.487a16 16 0 0 0-1.207-1.507c.402-.15.737-.436.948-.809a1.94 1.94 0 0 0 .07-1.677q.233-.1.43-.26a1.996 1.996 0 0 0 .09-2.594a1.32 1.32 0 0 0 .678-1.328a2.44 2.44 0 0 0-1.457-1.437a3 3 0 0 0-.61-.22q-.307-.09-.628-.12q-.96-.013-1.917.07l-.658.06a1 1 0 0 0-.19-.09l-.928-.24c-.26 0-.52-.11-.789-.14a4 4 0 0 0-.609 0a4.3 4.3 0 0 0-1.627.68c-1.108.738-2.455 1.856-2.864 2.206c-.29.213-.639.335-.999.349H5.693a.28.28 0 0 0-.3.27a.29.29 0 0 0 .28.309c.774.103 1.556.136 2.336.1a2.4 2.4 0 0 0 1.068-.38c.409-.27 1.507-1.068 2.525-1.706c.468-.36 1-.627 1.567-.789q.2-.022.4 0c.239 0 .479.09.708.13l.719.21c.28.1.479.209.519.389s-.1.29-.33.449a2.6 2.6 0 0 1-.888.439q-.541.13-1.098.17a.49.49 0 0 0-.46.509q.015.12 0 .24a2.7 2.7 0 0 1-.588 1.906a3.25 3.25 0 0 1-2.096.998a.33.33 0 0 0-.29.37a.32.32 0 0 0 .3.289c-.42.549-.809 1.108-1.178 1.687q-.675 1.063-1.228 2.196a11 11 0 0 0-.649 1.747a6.6 6.6 0 0 0-.24 1.267a4.18 4.18 0 0 0 1.468 3.384a9 9 0 0 0 4.851 2.166a8.47 8.47 0 0 0 5.24-.998a5.36 5.36 0 0 0 2.556-4.672a5.7 5.7 0 0 0-.06-1.088a9 9 0 0 0-.25-1.048m-1.717-4.272a1 1 0 0 1-1.148.32a3.85 3.85 0 0 1-1.837-.66a.84.84 0 0 1-.42-.808a.84.84 0 0 1 .2-.38l.08-.059q.324.17.67.29a6.7 6.7 0 0 0 1.666.339q.503.027.998-.06a1.18 1.18 0 0 1-.21 1.018m.609-2.236a1.1 1.1 0 0 1-.44.14q-.444.045-.888 0a8 8 0 0 1-1.417-.26a4.6 4.6 0 0 1-.73-.22c.17-.149-.049-.688.1-.997q.086-.256.25-.47c.371.213.777.358 1.198.43a4.8 4.8 0 0 0 1.897 0l.14-.05c.132.186.214.402.239.629a1 1 0 0 1-.35.798M17.99 5.65l.998.369c.315.124.589.335.789.609c.09.13 0 .26-.23.409l-.339.18c-.492.16-1.01.224-1.527.19a3.1 3.1 0 0 1-.889-.2a.3.3 0 0 0-.299-.19l-.12-.08c.222-.282.322-.641.28-.998a1.7 1.7 0 0 0-.14-.37q.74.003 1.477.08m-.25 16.39a7.5 7.5 0 0 1-4.59.778a8.14 8.14 0 0 1-4.213-1.827a3.32 3.32 0 0 1-1.258-2.535a5.6 5.6 0 0 1 .23-1.377q.201-.704.509-1.368q.473-1.12 1.078-2.176a23 23 0 0 1 1.337-1.996a.3.3 0 0 0 0-.12a3.66 3.66 0 0 0 1.907-.998c.577-.62.904-1.43.918-2.276a5.7 5.7 0 0 0 1.108-.18q.42-.128.799-.35a2.6 2.6 0 0 0-.36.6c-.177.39-.25.82-.21 1.248q.02.176.11.329l-.09.06c-.168.16-.295.358-.369.579a1.63 1.63 0 0 0 .52 1.856a4.6 4.6 0 0 0 2.305.999q.2.015.4 0c.459.588.948 1.147 1.337 1.766c.25.402.439.84.559 1.298q.125.491.17.998q.037.469 0 .938a4.52 4.52 0 0 1-2.156 3.753zM11.652 3.114l.459.889a.29.29 0 0 0 .4.11a.3.3 0 0 0 .12-.4l-.34-.818l-.11-.58c0-.409 0-.598.19-.648c.247-.022.496.012.728.1c.375.114.767.161 1.158.14q.276-.057.52-.2c.199-.12.398-.29.608-.43s.14-.15.22-.13s.13.14.2.22q.142.215.309.41q.167.185.389.3c.52.133 1.072.057 1.537-.21c.17-.07.33-.15.49-.2h.11q.06.25.059.509l-.14.679l-.39.838a.34.34 0 0 0 .09.46a.318.318 0 0 0 .46-.13l.529-.919l.26-.858a1.49 1.49 0 0 0-.23-1.298a1.34 1.34 0 0 0-1.368-.09l-.638.17c-.11 0-.2.08-.28 0s-.16-.21-.25-.34a2 2 0 0 0-.399-.459a1.2 1.2 0 0 0-.469-.2a1.13 1.13 0 0 0-.699.06q-.395.181-.728.46q-.174.169-.4.26a3.4 3.4 0 0 1-.998-.08a2.1 2.1 0 0 0-.998.06c-.43.17-.818.558-.659 1.577z" /></g></svg>
);

export const CubeIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m12 21l8.131-4.208c.316-.164.474-.245.589-.366a1 1 0 0 0 .226-.373c.054-.159.054-.336.054-.692V7.533M12 21l-8.131-4.208c-.316-.164-.474-.245-.589-.366a1 1 0 0 1-.226-.373C3 15.894 3 15.716 3 15.359V7.533M12 21v-9.063m9-4.404l-9 4.404m9-4.404l-8.27-4.28c-.267-.138-.4-.208-.541-.235a1 1 0 0 0-.378 0c-.14.027-.274.097-.542.235L3 7.533m0 0l9 4.404" /></svg>
);

export const TruckIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M.75 7.5h9.75l.75 1.5H1.5zm1 3h9.75l.75 1.5H2.5zm16.25 8c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5s.67 1.5 1.5 1.5m1.5-9H17V12h4.46zM8 18.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5s.67 1.5 1.5 1.5M20 8l3 4v5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3h-4c0 1.66-1.35 3-3 3c-1.66 0-3-1.34-3-3H3v-3.5h2V15h.76c.55-.61 1.35-1 2.24-1s1.69.39 2.24 1H15V6H3c0-1.11.89-2 2-2h12v4z" />
    </svg>
);

export const ArchiveBoxIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5v-1.5a1.5 1.5 0 0 0-1.5-1.5h-13.5a1.5 1.5 0 0 0-1.5 1.5v1.5Z" />
    </svg>
);

export const StarIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
);

export const Cog6ToothIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 0 1 0 1.985c.007.379.146.752.438.992l1.004.827a1.125 1.125 0 0 1 .26 1.431l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.127c-.331.183-.581.495-.644.87l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 0 1 0-1.985c-.007-.379-.146-.752-.438-.992l-1.003-.827a1.125 1.125 0 0 1-.26-1.431l1.296-2.247a1.125 1.125 0 0 1 1.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.086.22-.127.331-.183.581-.495.644-.87l.213-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);
export const LogoutIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#FF0000" d="M5 3h6a3 3 0 0 1 3 3v4h-1V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4h1v4a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3m3 9h11.25L16 8.75l.66-.75l4.5 4.5l-4.5 4.5l-.66-.75L19.25 13H8z" /></svg>
);

export const XMarkIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const InformationCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.25.25m0 0l-1.5 1.5m1.5-1.5-1.5 1.5m-1.5-1.5V5.625a2.25 2.25 0 0 1 2.25-2.25h1.5a2.25 2.25 0 0 1 2.25 2.25v1.5m-5.25 0h-1.5a2.25 2.25 0 0 0-2.25 2.25v1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008a.75.75 0 0 1 .75-.75h.008Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);
