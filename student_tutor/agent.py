
from typing import Dict, Any
from google.adk.agents import Agent
from google.adk.tools.tool_context import ToolContext


def _ensure_state(tool_context: ToolContext, key: str, default):
    if key not in tool_context.state:
        tool_context.state[key] = default
    return tool_context.state[key]

def solve_math(problem: str, tool_context: ToolContext) -> Dict[str, Any]:
    """A simple math solver helper.
    - `problem` is a short text description or expression (e.g. "integrate x^2" or "solve 2x+3=7").
    - This function returns a short solution and stores the topic in session state.

    Note: For advanced symbolic math you could integrate sympy; here we keep it lightweight
    so the Agent can call this tool when the user asks for numeric or algebra help.
    """
    recent = _ensure_state(tool_context, "recent_topics", [])
    if "math:" + problem not in recent:
        recent.append("math:" + problem)
        tool_context.state["recent_topics"] = recent

    solution = None
    try:

        import re
        if re.fullmatch(r"[0-9\s+\-*/().%^]+", problem.replace('^','**')):
            expr = problem.replace('^', '**')
            solution = eval(expr)
            return {"topic": problem, "solution": solution, "type": "numeric-eval"}
    except Exception:
        solution = None

    if "solve" in problem.lower() or "=" in problem:

        try:
            lhs, rhs = problem.split("=")
            lhs = lhs.strip(); rhs = rhs.strip()

            return {"topic": problem, "solution": "Attempted algebraic steps (use CAS for full solution)", "type": "algebra-hint"}
        except Exception:
            pass

    return {"topic": problem, "solution": "I can help outline steps — please provide the exact expression or ask for a numeric evaluation.", "type": "hint"}


def explain_literature(prompt: str, tool_context: ToolContext, level: str = "high-school") -> Dict[str, Any]:
    """Provides a short, leveled explanation of a literary topic (theme, poem, passage summary).
    - `prompt` might be a poem name, passage, or question (e.g. "explain Macbeth Act 1 scene 5").
    - `level` controls depth: 'elementary', 'high-school', 'undergrad'.
    """
    recent = _ensure_state(tool_context, "recent_topics", [])
    tag = f"lit:{prompt}|{level}"
    if tag not in recent:
        recent.append(tag)
        tool_context.state["recent_topics"] = recent
    if level == "elementary":
        detail = "Short, simple points and examples suitable for young learners."
    elif level == "undergrad":
        detail = "Deeper analysis: themes, devices, historic context, and critical reading suggestions."
    else:
        detail = "Clear explanations, key devices and sample questions for discussion."

    return {"prompt": prompt, "level": level, "explanation": f"Explanation for '{prompt}' ({level}): {detail}", "type": "literature"}


def translate_text(text: str, tool_context: ToolContext, target_language: str = "en") -> Dict[str, Any]:
    """A tiny translation helper. Replace with a call to a real translation API in production.
    The tool also updates the user's preferred language if asked explicitly.
    """
    if target_language:
        tool_context.state["preferred_language"] = target_language

    return {"original": text, "translated": f"[{target_language}] {text}", "target_language": target_language}


def get_progress(tool_context: ToolContext) -> Dict[str, Any]:
    """Return a compact view of session progress and recent topics the student worked on."""
    progress = tool_context.state.get("progress", {})
    recent = tool_context.state.get("recent_topics", [])
    preferred_language = tool_context.state.get("preferred_language", None)
    return {"progress": progress, "recent_topics": recent, "preferred_language": preferred_language}

student_tutor_agent = Agent(
    name="student_tutor_agent",
    model="gemini-2.0-flash",
    description=(
        "A multi-tool student tutor agent that helps with numerical and literary learning, "
        "and can operate in multiple languages. Tools: solve_math, explain_literature, translate_text, get_progress."
    ),
    instruction=(
        "You are a friendly student tutor. Use the tools when appropriate:\n"
        "- solve_math(problem, tool_context): evaluate or give step hints for numeric/algebra questions.\n"
        "- explain_literature(prompt, tool_context, level): explain literary texts at requested depth.\n"
        "- translate_text(text, tool_context, target_language): translate or switch the student's preferred language.\n"
        "- get_progress(tool_context): return session-level progress and recent topics.\n\n"
        "Keep responses encouraging, adapt explanations to the user's level, and store light session state like recent_topics and preferred_language."
    ),
    tools=[solve_math, explain_literature, translate_text, get_progress],
)
 
root_agent = student_tutor_agent

