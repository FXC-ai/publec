import styles from "./Tag.module.css"

interface PropsTag
{
    name : string
}


export default function Tag ({name} : PropsTag)
{
    return (

        <span className={styles.tag}>{name}</span>
    );

}