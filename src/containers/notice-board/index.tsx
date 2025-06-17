import Notice from "@/components/NoticeBoard";

const NoticeBoardContainer = () => {
    return (
        <div className="notice-board">
            <div className="page-title mb-3">
                <h1 className="mb-0">Notice Board</h1>
            </div>
            <div className="content">
                <div className="row g-3">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div className="col-md-3">
                            <Notice />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default NoticeBoardContainer;