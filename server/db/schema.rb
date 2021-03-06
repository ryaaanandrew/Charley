# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_04_05_145738) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "lists", force: :cascade do |t|
    t.string "trip_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "parks", force: :cascade do |t|
    t.string "full_name"
    t.string "name"
    t.string "country"
    t.string "prov_state"
    t.decimal "lat"
    t.decimal "long"
    t.text "description"
    t.string "twitter"
    t.string "url"
    t.integer "established"
    t.boolean "unesco"
    t.text "weather_info"
    t.string "designation"
    t.string "photo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "parks_routes", force: :cascade do |t|
    t.integer "route_id"
    t.integer "park_id"
  end

  create_table "routes", force: :cascade do |t|
    t.string "origin"
    t.string "destination"
    t.string "trip_id"
    t.integer "list_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "todos", force: :cascade do |t|
    t.string "todo_item"
    t.boolean "is_completed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "list_id"
    t.index ["list_id"], name: "index_todos_on_list_id"
  end

  create_table "trips", force: :cascade do |t|
    t.string "trip_id"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
