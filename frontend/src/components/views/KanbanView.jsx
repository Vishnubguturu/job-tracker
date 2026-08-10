import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, MapPin } from 'lucide-react'
import GlassCard from '../shared/GlassCard'
import StageBadge from '../shared/StageBadge'
import StatsBar from '../shared/StatsBar'
import Modal from '../shared/Modal'
import JobForm from '../shared/JobForm'
import { STATUS_OPTIONS, getAvatarColor, STATUS_COLORS } from '../../lib/constants'

export default function KanbanView({ jobs, stats, updateJobStatus, handleSave }) {
  const [modal, setModal] = useState(null)

  const columns = STATUS_OPTIONS.map(status => ({
    status,
    jobs: jobs.filter(j => j.status === status),
    ...STATUS_COLORS[status],
  }))

  function onDragEnd(result) {
    if (!result.destination) return
    const jobId = parseInt(result.draggableId)
    const newStatus = result.destination.droppableId
    updateJobStatus(jobId, newStatus)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Board</h1>
          <p className="text-sm text-text-secondary mt-1">Drag and drop to update application status</p>
        </div>
        <button onClick={() => setModal({ type: 'add' })} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-main to-teal-glow hover:shadow-lg hover:shadow-teal-main/25 text-white text-sm font-medium transition-all duration-300 cursor-pointer">
          <Plus size={16} />
          Add Application
        </button>
      </div>

      <StatsBar stats={stats} />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map(col => (
            <Droppable key={col.status} droppableId={col.status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-shrink-0 w-[280px] rounded-2xl p-3 transition-all duration-300 ${
                    snapshot.isDraggingOver ? 'bg-glass-hover border-teal-main/20 shadow-lg shadow-teal-main/5' : 'bg-white/5 border-glass-border'
                  } border backdrop-blur-xl`}
                >
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <span className="text-sm font-medium text-text-primary">{col.status}</span>
                    <span className="text-xs text-text-muted ml-auto bg-white/5 px-2 py-0.5 rounded-full">{col.jobs.length}</span>
                  </div>

                  <div className="space-y-2 min-h-[100px]">
                    {col.jobs.map((job, index) => (
                      <Draggable key={job.id} draggableId={String(job.id)} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => setModal({ type: 'edit', job })}
                          >
                            <GlassCard
                              className={`p-3 cursor-pointer ${snapshot.isDragging ? 'shadow-2xl ring-1 ring-teal-glow/40 scale-[1.02]' : ''}`}
                              hover
                            >
                              <div className="flex items-center gap-2.5 mb-2">
                                <div
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-semibold shrink-0"
                                  style={{ backgroundColor: getAvatarColor(job.company) }}
                                >
                                  {job.company.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-text-primary truncate">{job.company}</p>
                                  <p className="text-xs text-text-secondary truncate">{job.role}</p>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                {job.location && (
                                  <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
                                    <MapPin size={10} />
                                    {job.location}
                                  </span>
                                )}
                                <StageBadge stage={job.next_stage} />
                              </div>
                            </GlassCard>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {modal && (
        <Modal title={modal.type === 'add' ? 'New Application' : 'Edit Application'} onClose={() => setModal(null)}>
          <JobForm
            job={modal.type === 'edit' ? modal.job : null}
            onSave={(data) => { handleSave(data, modal.type === 'edit' ? modal.job.id : null); setModal(null) }}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  )
}
