import fs from "fs/promises";


import rehypeStringify from 'rehype-stringify'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'



export async function importChapterContent (filePath : string)
{
  try
  {
    // const filePath = path.join(process.cwd(), "public", "projets" ,projet, "tutoriel",`chapitre${chapter}.md`);
    const source = await fs.readFile(filePath, { encoding: 'utf8' });
    return source;
  }
  catch (error)
  {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null
    throw error
  }
}

export async function convertMarkdownToHTML (source : string)
{
  const processedContent = await unified()
                                .use(remarkParse)
                                .use(remarkMath)
                                .use(remarkFrontmatter)
                                .use(remarkGfm)
                                .use(remarkRehype)
                                .use(rehypeKatex, {output: 'mathml'})
                                .use(rehypeStringify)
                                .process(source)

    return processedContent;
}