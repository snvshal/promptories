# Promptories

Promptories is a prompt library and social media-like application built with Next.js (App Router), Vercel, shadcn-ui, and Tailwind CSS. The app is designed to help users store, share, and learn effective prompting techniques by showcasing various AI-generated responses based on different prompts. It includes features for storing, sharing, tagging, and categorizing prompts, making it a useful tool for prompt engineers, AI enthusiasts, and anyone looking to refine their skills in AI interactions.

## Features

- **Prompt Library**: Store and manage prompts with AI-generated responses.
- **Social Media Integration**: Like, comment, and share prompts with the community.
- **Tagging and Categorization**: Organize prompts using tags and categories like 'tags', 'prompt', 'response', and 'caption'.
- **User Profiles**: Follow other users and view their prompt collections.
- **Notification System**: Stay updated with notifications for interactions like follows, likes, and comments.
- **Search Functionality**: Search through prompts using various filters and categories.
- **Media Uploads**: Upload and share media (images/videos) as part of your prompt content using Cloudinary.
- **Real-time Updates**: Enjoy a dynamic experience with real-time updates and interactions.
- **Admin Features**: Manage your own profile and view detailed user analytics.
- **AI Chats**: Share and explore detailed conversations with AI.

## Tech Stack

- **Frontend**: Next.js (App Router), shadcn-ui, Tailwind CSS
- **Backend**: Next.js Server Actions, MongoDB (via Mongoose)
- **Storage**: Cloudinary (for media uploads)
- **Deployment**: Vercel

## Installation

To run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/snvshal/promptories.git
   ```

2. Navigate to the project directory:

   ```bash
   cd promptories
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file and set your environment variables.

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open your browser at [http://localhost:3000](http://localhost:3000) to see the app in action.

## Usage

1. **Creating a Prompt**:

   - Navigate to the 'New Prompt' page and enter your prompt details.
   - Optionally add tags, category, and media (image/video).
   - Click 'Save' to store your prompt.

2. **Interacting with Prompts**:

   - Browse and search prompts by tags, category, or user.
   - Like, comment, and share prompts within the community.
   - Follow other users to see their latest prompts in your feed.

3. **Managing Notifications**:
   - View new notifications from the notifications page.
   - Mark notifications as 'seen' or 'read' to stay organized.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
