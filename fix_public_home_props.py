import re

with open('src/components/PublicHome.tsx', 'r') as f:
    content = f.read()

old_interface = '''interface PublicHomeProps {
  settings: ISiteSettings;
  courses: ICourse[];
  posts: IPost[];
  onSelectPost: (post: IPost) => void;
  onGoToPanel: () => void;
  onRegisterAuthor: () => void;
}

export function PublicHome({ settings, courses, posts, onSelectPost, onGoToPanel, onRegisterAuthor }: PublicHomeProps) {'''

new_interface = '''interface PublicHomeProps {
  settings: ISiteSettings;
  courses: ICourse[];
  posts: IPost[];
  onSelectPost: (post: IPost) => void;
  onGoToPanel: () => void;
  onRegisterAuthor: () => void;
  onStudentLogin?: () => void;
  onStudentRegister?: () => void;
}

export function PublicHome({ settings, courses, posts, onSelectPost, onGoToPanel, onRegisterAuthor, onStudentLogin, onStudentRegister }: PublicHomeProps) {'''

content = content.replace(old_interface, new_interface)

with open('src/components/PublicHome.tsx', 'w') as f:
    f.write(content)
