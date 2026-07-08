const fs = require('fs');
let content = fs.readFileSync('src/components/StudentPanel.tsx', 'utf8');

const stateTarget = `  const [activeQuiz, setActiveQuiz] = useState<IQuiz | null>(null);
  const [quizState, setQuizState] = useState<"idle" | "intro" | "playing" | "result">("idle");
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<{score: number, passed: boolean} | null>(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);`;

const stateReplacement = stateTarget + `
  
  // Post Comments State
  const [postComments, setPostComments] = useState<IComment[]>([]);
  const [postCommentText, setPostCommentText] = useState("");
  const [submittingPostComment, setSubmittingPostComment] = useState(false);`;

content = content.replace(stateTarget, stateReplacement);

const effectTarget = `  useEffect(() => {
    if (selectedCourse) {
      fetchCourseDetails(selectedCourse._id);
    }
  }, [selectedCourse]);`;

const effectReplacement = effectTarget + `

  useEffect(() => {
    if (selectedPost) {
      fetch(\`/api/posts/\${selectedPost._id}/comments\`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setPostComments(data);
        })
        .catch(err => console.error("Error fetching comments:", err));
    }
  }, [selectedPost]);`;

content = content.replace(effectTarget, effectReplacement);

const handlerTarget = `  // Submit QnA Question
  const handleSubmitQna = async (e: React.FormEvent) => {`;

const handlerReplacement = `  // Submit Post Comment
  const handleSubmitPostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !postCommentText.trim()) return;
    setSubmittingPostComment(true);
    try {
      const res = await fetch(\`/api/posts/\${selectedPost._id}/comments\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: currentUser.name,
          email: currentUser.email,
          text: postCommentText.trim(),
          role: "student"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPostComments(prev => [data.comment, ...prev]);
        setPostCommentText("");
        showToast("نظر شما با موفقیت ثبت شد.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingPostComment(false);
    }
  };

  // Submit QnA Question
  const handleSubmitQna = async (e: React.FormEvent) => {`;

content = content.replace(handlerTarget, handlerReplacement);

fs.writeFileSync('src/components/StudentPanel.tsx', content);
console.log('StudentPanel state and handlers for comments added');
