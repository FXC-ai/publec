import styles from "./Tag.module.css"

interface PropsTag
{
    name : string
}


export default function Tag ({name} : { name : string})
{
    return (

        <span className={styles.tag}>{name}</span>
    );

}

// import styles from './Tag.module.css';

// export default function Tag({ children }) {
//     return (
//         <span className={styles.tag}>
//             {children}
//         </span>
//     );
// }