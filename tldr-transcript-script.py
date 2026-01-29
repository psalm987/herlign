import re
import sys
from typing import List, Dict


def extract_transcript_from_text(text_content: str) -> List[Dict]:
    """Extract transcript from HTML-like text content"""
    
    # Pattern to find speaker blocks
    speaker_pattern = r'<span[^>]*class="[^"]*text-base-800[^"]*"[^>]*>([^<]+)</span>'
    
    # Pattern to find text within speech spans
    text_pattern = r'<span[^>]*class="[^"]*cursor-pointer[^"]*font-normal[^"]*"[^>]*>([^<]+)</span>'
    
    # Split by pages if present
    pages = re.split(r'={5,}\s*Page\s+\d+.*?={5,}', text_content, flags=re.DOTALL | re.IGNORECASE)
    
    transcript = []
    current_speaker = None
    current_text = []
    
    for page in pages:
        if not page.strip():
            continue
            
        # Find all speaker tags
        speaker_positions = []
        for match in re.finditer(speaker_pattern, page):
            speaker_positions.append((match.start(), match.group(1).strip()))
        
        # Process each speaker section
        for i, (pos, speaker) in enumerate(speaker_positions):
            # Find the text between this speaker and the next
            end_pos = speaker_positions[i + 1][0] if i + 1 < len(speaker_positions) else len(page)
            section = page[pos:end_pos]
            
            # Extract all text fragments from this section
            text_fragments = re.findall(text_pattern, section)
            if text_fragments:
                # Clean and join text
                cleaned_text = ' '.join(text_fragments)
                cleaned_text = re.sub(r'\s+([.,!?])', r'\1', cleaned_text)  # Fix spacing
                cleaned_text = ' '.join(cleaned_text.split())  # Normalize whitespace
                
                # Add to transcript
                transcript.append({
                    'speaker': speaker,
                    'text': cleaned_text
                })
    
    return transcript


def format_transcript(transcript: List[Dict]) -> str:
    """Format transcript into readable text"""
    if not transcript:
        return "No transcript found."
    
    output = []
    current_speaker = None
    
    for entry in transcript:
        if entry['speaker'] != current_speaker:
            output.append(f"\n{entry['speaker']}:")
            current_speaker = entry['speaker']
        
        output.append(f"  {entry['text']}")
    
    return "\n".join(output).strip()


def main_simple():
    """Simple command-line interface"""
    if len(sys.argv) < 2:
        print("Usage: python transcript_extractor.py <input_file.txt>")
        return
    
    input_file = sys.argv[1]
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: File '{input_file}' not found.")
        return
    except UnicodeDecodeError:
        print(f"Error: Could not read file '{input_file}'. Try UTF-8 encoding.")
        return
    
    print(f"Processing file: {input_file}")
    transcript = extract_transcript_from_text(content)
    
    print(f"\nFound {len(transcript)} transcript entries.")
    print("\n" + "="*60)
    print("EXTRACTED TRANSCRIPT:")
    print("="*60)
    
    formatted = format_transcript(transcript)
    print(formatted)
    
    # Save to file
    output_file = "extracted_transcript.txt"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(formatted)
    
    print(f"\nTranscript saved to: {output_file}")


if __name__ == "__main__":
    # For the simple version (text files only):
    main_simple()
    
    # For the full version (PDF + text):
    # main()